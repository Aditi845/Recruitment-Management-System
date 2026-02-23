# Recruitment Management System Backend

## Setup

1. `cd Backend`
2. `npm install`
3. Create `.env` from `.env.example`
4. Start server:
   - Dev: `npm run dev`
   - Prod: `npm start`

## Environment Variables

- `PORT`: API port (default `5000`)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT signing

## API Base URL

`http://localhost:5000/api`

## Auth Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me` (Bearer token required)

## Job Endpoints

- `GET /jobs`
- `GET /jobs/:id`
- `POST /jobs` (recruiter/admin)
- `PUT /jobs/:id` (owner recruiter/admin)
- `DELETE /jobs/:id` (owner recruiter/admin)
- `GET /jobs/dashboard/recruiter/stats` (recruiter/admin)

## Application Endpoints

- `POST /applications/job/:jobId` (candidate)
- `GET /applications/me` (candidate)
- `GET /applications/dashboard/candidate/stats` (candidate/admin)
- `GET /applications/job/:jobId` (recruiter/admin)
- `PATCH /applications/:applicationId/status` (recruiter/admin)
