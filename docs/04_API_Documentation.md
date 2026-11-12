
# API Documentation

## 1. Base URL

Development backend:

http://localhost:5000

All API requests use the `/api` prefix.

## 2. Authentication APIs

Base path: `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | /register | Register a citizen |
| POST | /login | Login user |

### Register Request

```json
{
  "name": "Demo Citizen",
  "email": "citizen@example.com",
  "mobile": "9876543210",
  "password": "Password123"
}
```

### Login Request

```json
{
  "email": "citizen@example.com",
  "password": "Password123"
}
```

## 3. Grievance APIs

Base path: `/api/grievances`

| Method | Endpoint | Description |
|---|---|---|
| POST | /submit | Submit grievance |
| GET | /my-grievances | Get citizen grievances |
| GET | /track/:referenceId | Track grievance |

Citizen authentication is required for submission and personal grievance listing.

## 4. Department APIs

Base path: `/api/departments`

| Method | Endpoint | Description |
|---|---|---|
| GET | / | List departments |
| POST | / | Create department |

Department creation requires CMO authorization.

## 5. Assignment APIs

Base path: `/api/assignments`

| Method | Endpoint | Description |
|---|---|---|
| POST | / | Assign grievance to department and officer |

Requires CMO authorization.

## 6. Officer APIs

Base path: `/api/officer`

| Method | Endpoint | Description |
|---|---|---|
| GET | /my-assignments | View assigned grievances |
| PUT | /update-status/:grievanceId | Update grievance status |
| POST | /submit-report/:grievanceId | Submit action-taken report |

Requires officer authentication.

## 7. CMO APIs

Base path: `/api/cmo`

| Method | Endpoint | Description |
|---|---|---|
| GET | /dashboard | Dashboard statistics |
| GET | /grievances | List and filter grievances |
| GET | /history/:grievanceId | View grievance history |
| GET | /officers | List officers |
| GET | /reports | View officer reports |
| PUT | /review-report/:assignmentId | Review officer report |
| PUT | /resolve/:grievanceId | Resolve grievance |

Requires CMO authentication.

## 8. Feedback APIs

Base path: `/api/feedback`

| Method | Endpoint | Description |
|---|---|---|
| POST | /:grievanceId | Submit citizen feedback |

Requires citizen authentication. Feedback is accepted only for resolved grievances.

## 9. Contact API

Base path: `/api/contact`

| Method | Endpoint | Description |
|---|---|---|
| POST | / | Submit contact enquiry |

## 10. Upload APIs

Base path: `/api/uploads`

File upload requires authentication and grievance ownership.

Allowed file types: JPEG, PNG, PDF.

Maximum file size: 5 MB.

## 11. Authorization Header

Protected APIs use:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## 12. Common HTTP Status Codes

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 400 | Invalid request |
| 401 | Authentication required |
| 403 | Access forbidden |
| 404 | Resource not found |
| 500 | Internal server error |

Note: Endpoint documentation describes the implemented route structure. Request and response details should be verified against the final backend implementation.
