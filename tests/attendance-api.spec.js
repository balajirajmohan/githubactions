// @ts-check
import { test, expect } from '@playwright/test';

let testEmployeeId = 'EMP' + Date.now();
let attendanceId;

test.describe('Office Attendance System API', () => {
  
  test('health check endpoint', async ({ request }) => {
    const response = await request.get('/health');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe('OK');
    expect(data.service).toBe('Office Attendance System');
  });

  test('clock in - create attendance record', async ({ request }) => {
    const response = await request.post('/api/attendance/clock-in', {
      data: {
        employeeId: testEmployeeId,
        employeeName: 'Test Employee',
        location: 'Main Office'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toBe('Clocked in successfully');
    expect(data.attendance).toHaveProperty('id');
    expect(data.attendance.employeeId).toBe(testEmployeeId);
    expect(data.attendance.status).toBe('clocked-in');
    
    // Save ID for later tests
    attendanceId = data.attendance.id;
  });

  test('prevent duplicate clock in', async ({ request }) => {
    const response = await request.post('/api/attendance/clock-in', {
      data: {
        employeeId: testEmployeeId,
        employeeName: 'Test Employee'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.message).toContain('Already clocked in');
  });

  test('get all attendance records', async ({ request }) => {
    const response = await request.get('/api/attendance');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data).toHaveProperty('attendance');
    expect(Array.isArray(data.attendance)).toBeTruthy();
    expect(data.attendance.length).toBeGreaterThan(0);
  });

  test('get attendance by employee ID', async ({ request }) => {
    const response = await request.get(`/api/attendance?employeeId=${testEmployeeId}`);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.attendance.length).toBeGreaterThan(0);
    expect(data.attendance[0].employeeId).toBe(testEmployeeId);
  });

  test('clock out - update attendance record', async ({ request }) => {
    // Wait a bit to ensure some time has passed
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const response = await request.post('/api/attendance/clock-out', {
      data: {
        employeeId: testEmployeeId
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.message).toBe('Clocked out successfully');
    expect(data.attendance.clockOut).toBeDefined();
    expect(data.attendance.hoursWorked).toBeGreaterThan(0);
    expect(data.attendance.status).toBe('clocked-out');
  });

  test('get employee summary', async ({ request }) => {
    const response = await request.get(`/api/attendance/summary/${testEmployeeId}`);
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.summary).toBeDefined();
    expect(data.summary.employeeName).toBe('Test Employee');
    expect(data.summary.totalDays).toBeGreaterThanOrEqual(1);
  });

  test('clock in validation - missing employee ID', async ({ request }) => {
    const response = await request.post('/api/attendance/clock-in', {
      data: {
        employeeName: 'Test Employee'
      }
    });
    
    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.message).toContain('required');
  });

  test('clock out without clock in', async ({ request }) => {
    const response = await request.post('/api/attendance/clock-out', {
      data: {
        employeeId: 'NONEXISTENT123'
      }
    });
    
    expect(response.status()).toBe(404);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.message).toContain('No active clock-in');
  });
});

