export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "employee";
}

export interface LeaveRequest {
  id: number;
  userId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  adminComment?: string;
  attachmentPath?: string;
  createdAt: string;
  updatedAt: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LeaveRequestsResponse {
  leaveRequests: LeaveRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
