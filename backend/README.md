# Employee Leave Management System - Backend

A robust backend API for managing employee leave requests with JWT authentication, role-based access control, and file upload support.

## Features

- **Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control (Admin/Employee)
  - Secure password hashing with bcrypt

- **Leave Management**

  - Create leave requests with file attachments
  - View personal leave history
  - Admin approval/rejection workflow
  - Pagination support

- **File Upload**

  - Support for documents and images
  - File type validation
  - Size limits

- **API Documentation**
  - Complete Swagger/OpenAPI documentation
  - Interactive API testing interface

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT
- **File Upload**: Multer
- **Documentation**: Swagger/OpenAPI
- **Validation**: Joi

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and configure your settings:

```bash
copy .env.example .env
```

Update the `.env` file with your database credentials and JWT secret:

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=employee_leave_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# File Upload
UPLOAD_PATH=uploads
MAX_FILE_SIZE=5242880
```

### 3. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE employee_leave_db;
```

Run the database migration:

```bash
npm run build
npm run db:migrate
```

### 4. Start the Server

For development:

```bash
npm run dev
```

For production:

```bash
npm run build
npm start
```

## API Documentation

Once the server is running, access the Swagger documentation at:

```
http://localhost:5000/api-docs
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Leave Requests

- `POST /api/leaves` - Create leave request (with file upload)
- `GET /api/leaves/my` - Get current user's leave requests
- `GET /api/leaves` - Get all leave requests (Admin only)
- `PUT /api/leaves/:id` - Update leave request status (Admin only)

## Default Admin Account

A default admin account is created during migration:

- **Email**: admin@company.com
- **Password**: admin123
- **Role**: admin

## File Upload

Supported file types:

- Images: JPEG, JPG, PNG
- Documents: PDF, DOC, DOCX

Maximum file size: 5MB (configurable)

## Database Schema

### Users Table

- id (Primary Key)
- email (Unique)
- password (Hashed)
- first_name
- last_name
- role (admin/employee)
- created_at
- updated_at

### Leave Requests Table

- id (Primary Key)
- user_id (Foreign Key)
- leave_type
- start_date
- end_date
- reason
- status (pending/approved/rejected)
- admin_comment
- attachment_path
- created_at
- updated_at

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with Joi
- File type validation
- CORS protection
- Helmet security headers
- SQL injection prevention with parameterized queries
