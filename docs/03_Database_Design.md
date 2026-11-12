
# Database Design

## 1. Database Overview

The project uses MongoDB as its database and Mongoose as its Object Data Modeling (ODM) library.

Database name: cmkerala

## 2. Collections

### 2.1 Users

Stores citizen, CMO administrator, and officer account details.

| Field | Data Type | Description |
|---|---|---|
| _id | ObjectId | Unique user ID |
| name | String | User name |
| email | String | Unique email |
| mobile | String | Mobile number |
| password | String | Hashed password |
| role | String | citizen, cmo, officer |
| createdAt | Date | Account creation date |

### 2.2 Grievances

Stores citizen complaints.

| Field | Data Type | Description |
|---|---|---|
| _id | ObjectId | Grievance ID |
| referenceId | String | Unique reference number |
| citizen | ObjectId | Citizen reference |
| district | String | District |
| category | String | Grievance category |
| subject | String | Complaint subject |
| description | String | Complaint details |
| priority | String | Low, Medium, High |
| status | String | Current status |
| department | String | Assigned department |
| createdAt | Date | Submission date |

### 2.3 Departments

Stores department information.

| Field | Data Type | Description |
|---|---|---|
| _id | ObjectId | Department ID |
| name | String | Department name |
| description | String | Department details |
| isActive | Boolean | Active status |

### 2.4 Assignments

Stores grievance assignment information.

| Field | Data Type | Description |
|---|---|---|
| _id | ObjectId | Assignment ID |
| grievance | ObjectId | Grievance reference |
| department | ObjectId | Department reference |
| officer | ObjectId | Assigned officer |
| assignedBy | ObjectId | CMO user reference |
| remarks | String | Assignment remarks |
| actionTakenReport | String | Officer report |
| reportStatus | String | Pending, Submitted, Reviewed |

### 2.5 Grievance History

Stores status changes and remarks.

| Field | Data Type | Description |
|---|---|---|
| _id | ObjectId | History ID |
| grievance | ObjectId | Grievance reference |
| status | String | Updated status |
| remarks | String | Update remarks |
| updatedBy | ObjectId | Responsible user |
| createdAt | Date | Update timestamp |

### 2.6 Attachments

Stores uploaded file information.

| Field | Data Type | Description |
|---|---|---|
| _id | ObjectId | Attachment ID |
| grievance | ObjectId | Grievance reference |
| fileName | String | Original file name |
| filePath | String | Stored file path |
| fileType | String | File MIME type |

### 2.7 Feedback

Stores citizen feedback.

| Field | Data Type | Description |
|---|---|---|
| _id | ObjectId | Feedback ID |
| grievance | ObjectId | Grievance reference |
| citizen | ObjectId | Citizen reference |
| rating | Number | Rating from 1 to 5 |
| comment | String | Citizen comments |

### 2.8 Contact Enquiries

Stores messages submitted through the contact form.

| Field | Data Type | Description |
|---|---|---|
| _id | ObjectId | Enquiry ID |
| name | String | Sender name |
| email | String | Sender email |
| subject | String | Message subject |
| message | String | Message details |

## 3. Relationships

- One citizen can submit multiple grievances.
- One grievance can have multiple history records.
- One grievance can have multiple attachments.
- One grievance can have assignment records.
- One department can receive multiple assignments.
- One officer can handle multiple assignments.
- One resolved grievance can receive citizen feedback.

## 4. Data Integrity

- Unique email addresses for users.
- Unique grievance reference IDs.
- Required field validation.
- Password hashing before storage.
- ObjectId references between related collections.
- Feedback restricted to resolved grievances.
