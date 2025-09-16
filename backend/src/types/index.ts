export interface User {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: "admin" | "employee";
  created_at: Date;
  updated_at: Date;
}

export interface LeaveRequest {
  id: number;
  user_id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  admin_comment?: string;
  attachment_path?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: "admin" | "employee";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateLeaveRequest {
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  userId: number;
  attachment_path?: string;
}

export interface UpdateLeaveRequest {
  id: number;
  status: "approved" | "rejected";
  admin_comment?: string;
}

export interface LeaveRequestWithUser {
  id: number;
  userId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  adminComment: string | null;
  attachmentPath: string | null;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  email: string;
}
