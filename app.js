import bodyParser from 'body-parser';
import express from 'express';

import attendanceRoutes from './routes/attendance.js';

const app = express();

app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'Office Attendance System' });
});

// Attendance routes
app.use('/api/attendance', attendanceRoutes);

// For local development and testing
if (process.env.NODE_ENV !== 'production' || process.env.CI) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Export for Vercel serverless
export default app;
