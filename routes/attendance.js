import { Router } from 'express';
import * as attendanceData from '../data/attendance-data.js';

const router = Router();

// Get all attendance records (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { employeeId, date, startDate, endDate } = req.query;
    
    let records;
    
    if (employeeId || date || (startDate && endDate)) {
      records = attendanceData.filterAttendance({
        employeeId,
        date,
        startDate,
        endDate
      });
    } else {
      records = attendanceData.getAllAttendance();
    }
    
    // Sort by clockIn descending
    records.sort((a, b) => new Date(b.clockIn) - new Date(a.clockIn));
    
    res.json({ 
      success: true,
      count: records.length,
      attendance: records 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch attendance records',
      error: error.message 
    });
  }
});

// Get attendance record by ID
router.get('/:id', async (req, res) => {
  try {
    const record = attendanceData.getAttendanceById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ 
        success: false,
        message: 'Attendance record not found' 
      });
    }
    
    res.json({ 
      success: true,
      attendance: record 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch attendance record',
      error: error.message 
    });
  }
});

// Clock in - Create new attendance record
router.post('/clock-in', async (req, res) => {
  try {
    const { employeeId, employeeName, location } = req.body;
    
    if (!employeeId || !employeeName) {
      return res.status(400).json({ 
        success: false,
        message: 'Employee ID and name are required' 
      });
    }
    
    // Check if employee already clocked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const allRecords = attendanceData.getAllAttendance();
    const existingRecord = allRecords.find(r => {
      const recordDate = new Date(r.clockIn);
      recordDate.setHours(0, 0, 0, 0);
      return r.employeeId === employeeId && 
             recordDate.getTime() === today.getTime() &&
             !r.clockOut;
    });
    
    if (existingRecord) {
      return res.status(400).json({ 
        success: false,
        message: 'Already clocked in today',
        attendance: existingRecord
      });
    }
    
    const newRecord = attendanceData.addAttendance({
      employeeId,
      employeeName,
      clockIn: new Date(),
      clockOut: null,
      hoursWorked: null,
      location: location || 'Office',
      status: 'clocked-in'
    });
    
    res.status(201).json({
      success: true,
      message: 'Clocked in successfully',
      attendance: newRecord
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to clock in',
      error: error.message 
    });
  }
});

// Clock out - Update attendance record
router.post('/clock-out', async (req, res) => {
  try {
    const { employeeId } = req.body;
    
    if (!employeeId) {
      return res.status(400).json({ 
        success: false,
        message: 'Employee ID is required' 
      });
    }
    
    // Find today's clock-in record
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const allRecords = attendanceData.getAllAttendance();
    const record = allRecords.find(r => {
      const recordDate = new Date(r.clockIn);
      recordDate.setHours(0, 0, 0, 0);
      return r.employeeId === employeeId && 
             recordDate.getTime() === today.getTime() &&
             !r.clockOut;
    });
    
    if (!record) {
      return res.status(404).json({ 
        success: false,
        message: 'No active clock-in found for today' 
      });
    }
    
    const clockOut = new Date();
    const clockIn = new Date(record.clockIn);
    const hoursWorked = ((clockOut - clockIn) / (1000 * 60 * 60)).toFixed(2);
    
    const updatedRecord = attendanceData.updateAttendance(record.id, {
      clockOut,
      hoursWorked: parseFloat(hoursWorked),
      status: 'clocked-out'
    });
    
    res.json({
      success: true,
      message: 'Clocked out successfully',
      attendance: updatedRecord
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to clock out',
      error: error.message 
    });
  }
});

// Get employee summary (total hours, days worked, etc.)
router.get('/summary/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.query;
    
    const summary = attendanceData.getEmployeeSummary(employeeId, month, year);
    
    if (!summary) {
      return res.status(404).json({ 
        success: false,
        message: 'No attendance records found for this employee' 
      });
    }
    
    res.json({ 
      success: true,
      summary 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch summary',
      error: error.message 
    });
  }
});

// Delete attendance record (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = attendanceData.deleteAttendance(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false,
        message: 'Attendance record not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Attendance record deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete attendance record',
      error: error.message 
    });
  }
});

export default router;
