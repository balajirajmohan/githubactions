# Deployment Guide - Office Attendance System

## Quick Deployment Checklist

### ✅ Step 1: Vercel Setup

1. **Sign up / Login to Vercel**: https://vercel.com
2. **Import your GitHub repository**
3. **That's it!** No environment variables needed (uses static data)

### ✅ Step 2: GitHub Secrets (Already Configured)

Your GitHub Actions workflow needs these secrets:

```
✅ VERCEL_TOKEN
✅ ORG_ID
✅ PROJECT_ID
```

PORT environment variable is set in workflow (PORT=8080).

### ✅ Step 3: Deploy

```bash
# Commit all changes
git add .
git commit -m "Office Attendance System with static data"
git push origin master
```

This will trigger:
1. GitHub Actions workflow
2. Lint → Test → Deploy to Vercel

## API Endpoints (After Deployment)

### Your Vercel URL
```
https://your-project-name.vercel.app
```

### Test Endpoints

**Health Check:**
```bash
curl https://your-project-name.vercel.app/health
```

**Get All Attendance:**
```bash
curl https://your-project-name.vercel.app/api/attendance
```

**Clock In:**
```bash
curl -X POST https://your-project-name.vercel.app/api/attendance/clock-in \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId": "EMP004",
    "employeeName": "John Doe",
    "location": "Main Office"
  }'
```

**Clock Out:**
```bash
curl -X POST https://your-project-name.vercel.app/api/attendance/clock-out \
  -H "Content-Type: application/json" \
  -d '{"employeeId": "EMP004"}'
```

**Get Employee Summary:**
```bash
curl https://your-project-name.vercel.app/api/attendance/summary/EMP001
```

## Troubleshooting

### Issue: Vercel 404 Error
**Solution**: Ensure `vercel.json` exists and is committed
- File location: `/vercel.json`
- Should contain routes configuration

### Issue: GitHub Actions Tests Fail
**Solution**: Check workflow logs
- Ensure server starts before tests
- All tests should pass with static data

### Issue: Data Not Persisting
**Expected Behavior**: This application uses **in-memory storage**
- Data resets on server restart
- Data resets on Vercel redeploy
- This is by design for simplicity

## Verification Steps

After deployment, verify:

1. ✅ Health endpoint responds: `/health`
2. ✅ Get all records: `GET /api/attendance` (returns 3 sample records)
3. ✅ Clock in works: `POST /api/attendance/clock-in`
4. ✅ Get records updates: `GET /api/attendance` (returns 4 records)
5. ✅ Clock out works: `POST /api/attendance/clock-out`

## Features

### ✅ What Works Out of the Box

- Clock in/out functionality
- Get all attendance records
- Filter by employee, date, date range
- Employee summary
- Delete records
- Automatic hours calculation
- Pre-loaded sample data (3 records)

### ⚠️ Data Limitations

**In-Memory Storage Means:**
- Data resets on server restart
- Not suitable for production without database
- Great for testing and demos
- Perfect for local development

### 🚀 To Make Production-Ready

Add a database:
1. MongoDB (cloud or self-hosted)
2. PostgreSQL (Vercel Postgres, Supabase)
3. MySQL (PlanetScale)
4. File-based storage (JSON files)

## Production Checklist

Before going live:

- [ ] Add authentication/authorization
- [ ] Add rate limiting
- [ ] Enable CORS properly
- [ ] Set up monitoring (Vercel Analytics)
- [ ] Configure custom domain (optional)
- [ ] Add database for persistent storage
- [ ] Implement backup strategy

## Monitoring

### Vercel Dashboard
- **Deployments**: View deployment history
- **Logs**: Real-time function logs
- **Analytics**: Request metrics

## Rollback

If deployment fails:

1. **Vercel**: Redeploy previous version from dashboard
2. **GitHub**: Revert commit and push
3. **Emergency**: Pause project in Vercel settings

## Local Development

### Run Locally
```bash
npm install
npm start
```

Server starts on `http://localhost:8080`

### Run Tests
```bash
npm test
```

### Run Linter
```bash
npm run lint
```

## Environment Variables

### Required (None!)
This app doesn't require any environment variables for basic operation.

### Optional
```
PORT=8080          # Server port (default: 8080)
NODE_ENV=production # Environment mode
```

## Support

- **Vercel Docs**: https://vercel.com/docs
- **GitHub Actions**: https://docs.github.com/actions
- **Express.js**: https://expressjs.com/

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test all endpoints
3. Consider adding:
   - Authentication (JWT, OAuth)
   - Admin dashboard
   - Database integration
   - Real-time updates (WebSockets)
   - Employee management
   - Reporting features

---

**Ready to Deploy!** 🚀

This simplified version:
- ✅ No database required
- ✅ No environment variables needed
- ✅ Works out of the box
- ✅ Perfect for demos and testing

Commit your changes and watch it deploy automatically!
