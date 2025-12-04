// In-memory data store for attendance records
// This is a simple static data implementation without database

let attendanceRecords = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    clockIn: new Date('2024-12-04T09:00:00'),
    clockOut: new Date('2024-12-04T17:30:00'),
    hoursWorked: 8.5,
    location: 'Main Office',
    status: 'clocked-out'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Jane Smith',
    clockIn: new Date('2024-12-04T08:30:00'),
    clockOut: new Date('2024-12-04T17:00:00'),
    hoursWorked: 8.5,
    location: 'Remote',
    status: 'clocked-out'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    employeeName: 'Mike Johnson',
    clockIn: new Date('2024-12-04T09:15:00'),
    clockOut: null,
    hoursWorked: null,
    location: 'Main Office',
    status: 'clocked-in'
  }
];

let nextId = 4;

// Helper function to generate unique ID
export function generateId() {
  return String(nextId++);
}

// Get all attendance records
export function getAllAttendance() {
  return [...attendanceRecords];
}

// Get attendance by ID
export function getAttendanceById(id) {
  return attendanceRecords.find(record => record.id === id);
}

// Filter attendance by criteria
export function filterAttendance(criteria) {
  let filtered = [...attendanceRecords];
  
  if (criteria.employeeId) {
    filtered = filtered.filter(r => r.employeeId === criteria.employeeId);
  }
  
  if (criteria.date) {
    const targetDate = new Date(criteria.date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    filtered = filtered.filter(r => {
      const clockInDate = new Date(r.clockIn);
      return clockInDate >= targetDate && clockInDate < nextDay;
    });
  }
  
  if (criteria.startDate && criteria.endDate) {
    const start = new Date(criteria.startDate);
    const end = new Date(criteria.endDate);
    
    filtered = filtered.filter(r => {
      const clockInDate = new Date(r.clockIn);
      return clockInDate >= start && clockInDate <= end;
    });
  }
  
  return filtered;
}

// Add new attendance record
export function addAttendance(attendanceData) {
  const newRecord = {
    id: generateId(),
    ...attendanceData
  };
  attendanceRecords.push(newRecord);
  return newRecord;
}

// Update attendance record
export function updateAttendance(id, updates) {
  const index = attendanceRecords.findIndex(r => r.id === id);
  if (index === -1) return null;
  
  attendanceRecords[index] = {
    ...attendanceRecords[index],
    ...updates
  };
  
  return attendanceRecords[index];
}

// Delete attendance record
export function deleteAttendance(id) {
  const index = attendanceRecords.findIndex(r => r.id === id);
  if (index === -1) return false;
  
  attendanceRecords.splice(index, 1);
  return true;
}

// Find attendance by criteria
export function findAttendance(criteria) {
  return attendanceRecords.find(record => {
    return Object.keys(criteria).every(key => record[key] === criteria[key]);
  });
}

// Get employee summary
export function getEmployeeSummary(employeeId, month, year) {
  let records = attendanceRecords.filter(r => r.employeeId === employeeId);
  
  if (month && year) {
    records = records.filter(r => {
      const date = new Date(r.clockIn);
      return date.getMonth() + 1 === parseInt(month) && 
             date.getFullYear() === parseInt(year);
    });
  }
  
  if (records.length === 0) return null;
  
  const totalDays = records.length;
  const totalHours = records.reduce((sum, r) => sum + (r.hoursWorked || 0), 0);
  
  return {
    employeeId,
    employeeName: records[0].employeeName,
    totalDays,
    totalHours,
    records
  };
}

// Reset data (useful for testing)
export function resetData() {
  attendanceRecords = [
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      clockIn: new Date('2024-12-04T09:00:00'),
      clockOut: new Date('2024-12-04T17:30:00'),
      hoursWorked: 8.5,
      location: 'Main Office',
      status: 'clocked-out'
    }
  ];
  nextId = 2;
}

export default {
  getAllAttendance,
  getAttendanceById,
  filterAttendance,
  addAttendance,
  updateAttendance,
  deleteAttendance,
  findAttendance,
  getEmployeeSummary,
  generateId,
  resetData
};

