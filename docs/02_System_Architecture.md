
# System Architecture

## 1. Architecture Overview

CM Kerala uses a three-tier web application architecture.

1. Presentation Layer – React frontend.
2. Application Layer – Node.js and Express backend.
3. Data Layer – MongoDB database.

## 2. Architecture Diagram

```text
+-----------------------------+
|          Users              |
| Citizen | CMO | Officer     |
+-------------+---------------+
              |
              v
+-----------------------------+
|       React Frontend        |
|       Vite Application      |
|                             |
| Citizen Dashboard           |
| CMO Dashboard               |
| Officer Dashboard           |
+-------------+---------------+
              |
          Axios / HTTP
              |
              v
+-----------------------------+
|       Express Backend       |
|                             |
| Authentication Routes      |
| Grievance Routes            |
| Department Routes           |
| Assignment Routes           |
| Officer Routes              |
| CMO Routes                  |
| Feedback Routes             |
| Contact Routes              |
| Upload Routes               |
+-------------+---------------+
              |
              v
+-----------------------------+
|       MongoDB Database      |
|                             |
| Users                       |
| Grievances                  |
| Departments                 |
| Assignments                 |
| Grievance History           |
| Attachments                 |
| Feedback                    |
| Contact Enquiries           |
+-----------------------------+
```

## 3. Frontend Architecture

The frontend is developed using React.js.

Main responsibilities:

- Display user interfaces.
- Handle navigation using React Router.
- Manage component state using React hooks.
- Communicate with backend APIs using Axios.
- Display grievance information and reports.

## 4. Backend Architecture

The backend uses Node.js and Express.js.

Main responsibilities:

- Handle REST API requests.
- Authenticate users using JWT.
- Verify user roles.
- Manage grievance workflows.
- Store and retrieve MongoDB records.
- Handle file uploads using Multer.

## 5. Database Architecture

MongoDB stores application data in collections.

Mongoose models define the structure and relationships of application records.

## 6. Authentication Flow

1. User submits login credentials.
2. Backend checks the user record.
3. Password is verified using bcryptjs.
4. Backend generates a JWT token.
5. Frontend stores the token in localStorage.
6. Protected APIs verify the token and user role.

## 7. API Communication

The React frontend communicates with the Express backend through HTTP requests.

JSON is used for most API request and response data.

File uploads use multipart/form-data.

## 8. Security

- Password hashing using bcryptjs.
- JWT-based authentication.
- Role-based route protection.
- Input validation.
- Restricted file types and upload size.
- Environment variables for configuration.
