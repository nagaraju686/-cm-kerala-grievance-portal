
# Setup and Testing Guide

## 1. Prerequisites

Install the following software:

- Node.js
- npm
- MongoDB Community Server
- Visual Studio Code
- Web browser

## 2. Project Setup

Open the project folder in Visual Studio Code.

### Backend Setup

Open a terminal:

```bash
cd server
npm install
```

Create a `.env` file inside the server folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/cmkerala
JWT_SECRET=replace_with_a_secure_random_secret
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Expected result:

```text
Server running on port 5000
MongoDB connected successfully
```

### Frontend Setup

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Open the frontend:

http://localhost:5173

## 3. Demo Accounts

### CMO Administrator

Email: cmo@cmkerala.demo

Password: CMO@12345

### Department Officer

Email: officer@cmkerala.demo

Password: Officer@12345

### Citizen

Use a citizen account created through registration.

Note: These are local development demo credentials. Change them before any public deployment.

## 4. Testing Scenarios

| Test | Expected Result |
|---|---|
| Citizen registration | Account created |
| Citizen login | Login successful |
| Submit grievance | Unique reference ID generated |
| Track grievance | Details and history displayed |
| CMO login | CMO dashboard displayed |
| Assign grievance | Officer assignment created |
| Officer login | Assigned grievance displayed |
| Update status | Grievance status updated |
| Submit officer report | Report saved |
| CMO review | Report marked reviewed |
| Resolve grievance | Status changed to Resolved |
| Citizen feedback | Feedback saved |

## 5. Testing Results

The following workflow was manually tested in the local development environment:

1. Citizen submitted a grievance.
2. CMO assigned the grievance to an officer.
3. Officer viewed the assignment.
4. Officer submitted an action-taken report.
5. CMO reviewed the report.
6. CMO resolved the grievance.
7. Citizen submitted feedback.

## 6. Troubleshooting

### Backend Not Starting

- Check Node.js installation.
- Run `npm install` in the server folder.
- Verify the `.env` file.
- Confirm MongoDB is running.

### Frontend API Errors

- Check that backend runs on port 5000.
- Check that frontend runs on port 5173.
- Verify the JWT token and user role.
- Check browser console and server terminal.

### MongoDB Connection Error

- Start MongoDB Community Server.
- Verify the MONGO_URI value.

## 7. Security Notes

- Never commit `.env` files to GitHub.
- Use a strong JWT secret.
- Change demo passwords before deployment.
- Use HTTPS in production.
- Validate uploaded files and user input.
