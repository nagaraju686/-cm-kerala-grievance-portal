# CM Kerala – Public Grievance Redressal Portal

A MERN Stack-based web application that allows citizens to submit and track public grievances. CMO administrators can review and assign complaints to departments, while officers can investigate and submit action-taken reports.

## Project Overview

The CM Kerala Public Grievance Redressal Portal is a prototype designed to simplify the grievance management process through a centralized web application.

**Note:** This is an independent academic prototype. It is not an official Government of Kerala or Chief Minister's Office website.

## Features

### Citizen
- Citizen registration and login
- Submit grievances with district, category, subject and description
- Track grievances using a reference ID
- View grievance status and history
- Submit feedback after grievance resolution

### CMO Administrator
- CMO login and dashboard
- View grievance statistics
- Filter grievances by district, category, priority and status
- Assign grievances to departments and officers
- Review officer action-taken reports
- Resolve grievances

### Department Officer
- View assigned grievances
- Update grievance status
- Add remarks
- Submit action-taken reports to CMO

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| API | REST API |
| File Upload | Multer |
| Charts | Recharts |

## Project Structure

```text
cm-kerala-grievance-portal/
├── client/
│   ├── src/
│   └── package.json
├── server/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── uploads/
│   └── server.js
├── docs/
│   ├── 01_Project_Overview.md
│   ├── 02_System_Architecture.md
│   ├── 03_Database_Design.md
│   ├── 04_API_Documentation.md
│   ├── 05_AI_Integration.md
│   ├── 06_Setup_and_Testing.md
│   └── 07_User_Guide.md
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js and npm
- MongoDB Community Server
- Git

### 1. Clone the repository

```bash
git clone https://github.com/nagaraju686/-cm-kerala-grievance-portal.git
cd -cm-kerala-grievance-portal
```

### 2. Start the backend

```bash
cd server
npm install
```

Create a `.env` file inside the server folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cmkerala
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3. Start the frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the frontend at:

http://localhost:5173

Backend runs at:

http://localhost:5000

## Demo Credentials

**CMO Administrator**
- Email: cmo@cmkerala.demo
- Password: CMO@12345

**Department Officer**
- Email: officer@cmkerala.demo
- Password: Officer@12345

Create a citizen account using the registration page.

## AI Integration Status

AI-powered grievance analysis and automatic department/priority suggestions are not implemented in this prototype.

## Testing

The main grievance workflow was tested locally:

1. Citizen submits a grievance.
2. CMO assigns it to a department/officer.
3. Officer submits an action-taken report.
4. CMO reviews the report and resolves the grievance.
5. Citizen submits feedback.

## Documentation
