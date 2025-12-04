# Office Attendance System API

A lightweight office attendance tracking system built with Express.js using in-memory data storage, with automated CI/CD via GitHub Actions and Vercel deployment.

## Features

- ✅ Clock in/out functionality
- ✅ Employee attendance tracking
- ✅ Date-based queries
- ✅ Employee attendance summaries
- ✅ Hours worked calculation
- ✅ RESTful API design
- ✅ In-memory data storage (no database required)
- ✅ Automated testing with Playwright
- ✅ CI/CD with GitHub Actions
- ✅ Serverless deployment on Vercel

## Tech Stack

- **Backend**: Express.js (Node.js)
- **Data Storage**: In-memory (static data)
- **Testing**: Playwright
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel (Serverless)
- **Linting**: ESLint

## Data Structure

### Attendance Record

```javascript
{
  id: String,               // Unique record ID
  employeeId: String,       // Unique employee identifier (e.g., "EMP001")
  employeeName: String,     // Employee full name
  clockIn: Date,            // Clock in timestamp
  clockOut: Date,           // Clock out timestamp (null if still clocked in)
  hoursWorked: Number,      // Calculated hours (set on clock out)
  location: String,         // Work location (default: "Office")
  status: String            // "clocked-in" or "clocked-out"
}
```

### Sample Data

The system includes pre-populated sample data:
- 3 employee attendance records
- Mix of completed and active clock-ins
- Different locations (Main Office, Remote)

## API Endpoints

### Base URL
- **Local**: `http://localhost:8080/api/attendance`
- **Production**: `https://your-app.vercel.app/api/attendance`

### Endpoints

#### 1. Health Check
```http
GET /health
```
**Response:**
```json
{
  "status": "OK",
  "service": "Office Attendance System"
}
```

#### 2. Clock In
```http
POST /api/attendance/clock-in
Content-Type: application/json

{
  "employeeId": "EMP004",
  "employeeName": "John Doe",
  "location": "Main Office"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Clocked in successfully",
  "attendance": {
    "id": "4",
    "employeeId": "EMP004",
    "employeeName": "John Doe",
    "clockIn": "2024-12-04T10:00:00.000Z",
    "clockOut": null,
    "hoursWorked": null,
    "location": "Main Office",
    "status": "clocked-in"
  }
}
```

#### 3. Clock Out
```http
POST /api/attendance/clock-out
Content-Type: application/json

{
  "employeeId": "EMP004"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Clocked out successfully",
  "attendance": {
    "id": "4",
    "employeeId": "EMP004",
    "clockIn": "2024-12-04T10:00:00.000Z",
    "clockOut": "2024-12-04T18:00:00.000Z",
    "hoursWorked": 8.0,
    "status": "clocked-out"
  }
}
```

#### 4. Get All Attendance Records
```http
GET /api/attendance
```
**Query Parameters:**
- `employeeId` - Filter by employee ID
- `date` - Filter by specific date (YYYY-MM-DD)
- `startDate` & `endDate` - Filter by date range

**Examples:**
```http
GET /api/attendance
GET /api/attendance?employeeId=EMP001
GET /api/attendance?date=2024-12-04
GET /api/attendance?startDate=2024-12-01&endDate=2024-12-31
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "attendance": [
    {
      "id": "3",
      "employeeId": "EMP003",
      "employeeName": "Mike Johnson",
      "clockIn": "2024-12-04T09:15:00.000Z",
      "clockOut": null,
      "hoursWorked": null,
      "location": "Main Office",
      "status": "clocked-in"
    }
    // ... more records
  ]
}
```

#### 5. Get Attendance Record by ID
```http
GET /api/attendance/:id
```
**Example:**
```http
GET /api/attendance/1
```

#### 6. Get Employee Summary
```http
GET /api/attendance/summary/:employeeId?month=12&year=2024
```
**Response:**
```json
{
  "success": true,
  "summary": {
    "employeeId": "EMP001",
    "employeeName": "John Doe",
    "totalDays": 20,
    "totalHours": 160.5,
    "records": [...]
  }
}
```

#### 7. Delete Attendance Record (Admin)
```http
DELETE /api/attendance/:id
```
**Response:**
```json
{
  "success": true,
  "message": "Attendance record deleted successfully"
}
```

## Installation & Setup

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd githubactions
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables

Create a `.env` file (optional - only PORT is needed):
```env
PORT=8080
```

### 4. Run Locally
```bash
npm start
```

Server will run on `http://localhost:8080`

## Testing

### Run All Tests
```bash
npm test
```

The tests will:
- Start the server automatically
- Run 9 comprehensive test cases
- Test all endpoints and edge cases

### Run Linter
```bash
npm run lint
```

## GitHub Actions Workflow

The CI/CD pipeline automatically:

1. ✅ **Lint** - Checks code quality with ESLint
2. ✅ **Test** - Runs Playwright API tests
3. ✅ **Deploy** - Deploys to Vercel on successful tests

### Workflow Triggers
- Push to `master` branch
- Pull requests to `master`

### Environment Variables (GitHub Secrets)

Set these in GitHub repository settings:

```
PORT=8080
VERCEL_TOKEN=<your-vercel-token>
ORG_ID=<your-org-id>
PROJECT_ID=<your-project-id>
```

## Vercel Deployment

### Prerequisites
1. Vercel account
2. Project connected to GitHub

### Environment Variables in Vercel

**Optional** - Set in Vercel dashboard if you want to customize:
```
NODE_ENV=production
PORT=8080
```

### Deploy
```bash
# Automatic on push to master
git push origin master

# Or manual via Vercel CLI
vercel --prod
```

## Project Structure

```
.
├── app.js                      # Express app configuration
├── routes/
│   └── attendance.js           # Attendance API routes
├── data/
│   └── attendance-data.js      # In-memory data storage
├── tests/
│   └── attendance-api.spec.js  # Playwright tests
├── .github/
│   └── workflows/
│       └── newworkflow.yml     # CI/CD pipeline
├── vercel.json                 # Vercel configuration
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

## Usage Examples

### Clock In
```bash
curl -X POST http://localhost:8080/api/attendance/clock-in \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP004",
    "employeeName": "John Doe",
    "location": "Main Office"
  }'
```

### Clock Out
```bash
curl -X POST http://localhost:8080/api/attendance/clock-out \
  -H "Content-Type: application/json" \
  -d '{"employeeId": "EMP004"}'
```

### Get All Records
```bash
curl http://localhost:8080/api/attendance
```

### Get Today's Attendance
```bash
curl "http://localhost:8080/api/attendance?date=$(date +%Y-%m-%d)"
```

### Get Employee Summary
```bash
curl "http://localhost:8080/api/attendance/summary/EMP001?month=12&year=2024"
```

## Data Persistence

⚠️ **Important**: This application uses **in-memory storage**. Data will be reset when:
- Server restarts
- Application redeploys
- Container recreates (on Vercel)

For production use, you may want to:
- Add database integration (MongoDB, PostgreSQL, etc.)
- Implement file-based storage
- Use external state management

## Error Handling

All API responses follow this format:

**Success:**
```json
{
  "success": true,
  "message": "...",
  "data": {...}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Features & Validations

### Clock In
- ✅ Requires `employeeId` and `employeeName`
- ✅ Prevents duplicate clock-ins on the same day
- ✅ Records location (defaults to "Office")
- ✅ Timestamps with current date/time

### Clock Out
- ✅ Requires `employeeId`
- ✅ Finds active clock-in for today
- ✅ Calculates hours worked
- ✅ Updates status to "clocked-out"

### Queries
- ✅ Filter by employee ID
- ✅ Filter by specific date
- ✅ Filter by date range
- ✅ Sorted by most recent first

## Sample Data

The application starts with 3 pre-loaded records:

1. **John Doe (EMP001)** - Clocked out, 8.5 hours
2. **Jane Smith (EMP002)** - Clocked out, 8.5 hours
3. **Mike Johnson (EMP003)** - Currently clocked in

You can modify the initial data in `data/attendance-data.js`.

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT

## Support

For issues or questions, please open an issue in the GitHub repository.

---

**Built with ❤️ using Express.js and Vercel**
