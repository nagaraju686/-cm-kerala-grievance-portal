
# CM Kerala – Public Grievance Redressal Portal

A full-stack grievance management portal prototype built using React, Node.js, Express.js, and MongoDB.

## Features

### Citizen
- Citizen registration and login
- Submit grievances with optional attachments
- Unique grievance reference ID
- Track grievance status and history
- Submit feedback after resolution

### CMO Administrator
- Dashboard with grievance statistics
- Filter grievances
- Assign grievances to departments and officers
- Review officer action-taken reports
- Resolve grievances

### Department Officer
- View assigned grievances
- Update grievance status
- Submit action-taken reports

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| File Upload | Multer |
| Charts | Recharts |

## Project Structure

```text
cm kerala portal/
├── client/
├── server/
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

## Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd "cm kerala portal"
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file using the `.env.example` template.

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open:

http://localhost:5173

## Database

This project uses MongoDB.

Default local database:

```text
mongodb://127.0.0.1:27017/cmkerala
```

Ensure MongoDB Community Server is running.

## Demo Accounts

**CMO**
- Email: cmo@cmkerala.demo
- Password: CMO@12345

**Officer**
- Email: officer@cmkerala.demo
- Password: Officer@12345

Citizens can register through the application.

These are local development demo credentials. Change them before public deployment.

## Documentation

See the `docs` folder for project overview, architecture, database design, API documentation, AI integration status, setup and testing, and user guide.

## AI Integration Status

AI-based classification, priority recommendations, and summarization are planned enhancements and are not implemented in the current prototype.

## Project Disclaimer

This is an educational prototype and is not an official Kerala Government or Chief Minister's Office service. It does not claim government endorsement.
