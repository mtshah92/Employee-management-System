# Employee Leave Management System

This repository contains a full-stack **Employee Leave Management System** with authentication, role-based access, and a simple dashboard. The project is split into **frontend** and **backend** folders, each containing its own README with setup instructions.

---

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Supports two roles: **admin** and **employee**

### Backend
- Built with **Express.js + TypeScript + PostgreSQL**
- Uses **Drizzle ORM** for database access
- Swagger (OpenAPI) documentation available at `/api-docs`
- Employees can request leaves and attach documents
- Admins can view all leave requests and approve/reject them

### Frontend
- Built with **Next.js + TypeScript**
- **Employee dashboard:** apply for leave, view leave history
- **Admin dashboard:** view all leave requests, approve/reject requests
- Protected routes based on authentication and role

### Bonus (Optional)
- Pagination for leave requests
- Email notifications on leave approval/rejection

---

## Folder Structure
├── backend/ # Backend API and server logic
└── frontend/ # Next.js frontend application

Each folder contains its own README with detailed setup instructions.
