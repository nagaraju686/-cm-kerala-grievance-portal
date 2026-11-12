
# CM Kerala – Public Grievance Redressal Portal

## 1. Project Overview

CM Kerala is a web-based public grievance redressal portal prototype. It allows citizens to submit complaints, track grievance status, and provide feedback after resolution.

The portal provides separate dashboards for Citizens, CMO Administrators, and Department Officers.

**Note:** This is an educational prototype. It is not an official Kerala Government or Chief Minister's Office service.

## 2. Project Objectives

- Provide an online grievance submission system.
- Allow citizens to track submitted complaints.
- Enable CMO administrators to review and assign grievances.
- Allow officers to investigate assigned complaints.
- Enable officers to submit action-taken reports.
- Allow CMO administrators to review reports and resolve grievances.
- Collect citizen feedback after resolution.

## 3. Technology Stack

### Frontend
- React.js
- Vite
- Axios
- React Router DOM
- Recharts
- Lucide React

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcryptjs
- Multer

### Database
- MongoDB
- Mongoose

## 4. User Roles

### Citizen
- Register and login.
- Submit grievances.
- Track grievance status.
- View grievance history.
- Submit feedback after resolution.

### CMO Administrator
- View grievance statistics.
- Filter grievances.
- Assign grievances to departments and officers.
- Review officer reports.
- Resolve grievances.

### Department Officer
- View assigned grievances.
- Update grievance status.
- Submit action-taken reports.

## 5. Grievance Workflow

1. Citizen submits a grievance.
2. System generates a unique reference ID.
3. CMO administrator reviews the grievance.
4. CMO assigns it to a department and officer.
5. Officer investigates the issue.
6. Officer updates status and submits an action-taken report.
7. CMO reviews the submitted report.
8. CMO resolves the grievance.
9. Citizen submits feedback.

## 6. Grievance Statuses

- Submitted
- Under Review
- In Progress
- Resolved
- Reopened

## 7. Project Scope

The project demonstrates role-based authentication, grievance management, department assignment, status tracking, report submission, feedback collection, and dashboard-based monitoring.

## 8. Future Enhancements

- AI-based grievance classification and department recommendations.
- Email and SMS notifications.
- Advanced analytics and reporting.
- Improved attachment security.
- Production deployment and scalability.
