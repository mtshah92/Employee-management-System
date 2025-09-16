import { eq, desc, count } from "drizzle-orm";
import { db } from "../database/connection";
import { leaveRequests, users } from "../database/schema";
import { CreateLeaveRequest, UpdateLeaveRequest } from "../types";

export const createLeaveRequestService = async (data: CreateLeaveRequest) => {
  const { userId, leave_type, start_date, end_date, reason, attachment_path } =
    data;

  const [leaveRequest] = await db
    .insert(leaveRequests)
    .values({
      userId,
      leaveType: leave_type,
      startDate: start_date,
      endDate: end_date,
      reason,
      attachmentPath: attachment_path,
    })
    .returning();

  return leaveRequest;
};

export const getMyLeaveRequestsService = async (
  userId: number,
  page: number,
  limit: number
) => {
  const offset = (page - 1) * limit;

  const leaveData = await db
    .select()
    .from(leaveRequests)
    .where(eq(leaveRequests.userId, userId))
    .orderBy(desc(leaveRequests.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ total }] = await db
    .select({ total: count() })
    .from(leaveRequests)
    .where(eq(leaveRequests.userId, userId));

  return {
    leaveRequests: leaveData,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getAllLeaveRequestsService = async (
  page: number,
  limit: number
) => {
  const offset = (page - 1) * limit;

  const allLeaveRequests = await db
    .select({
      id: leaveRequests.id,
      userId: leaveRequests.userId,
      leaveType: leaveRequests.leaveType,
      startDate: leaveRequests.startDate,
      endDate: leaveRequests.endDate,
      reason: leaveRequests.reason,
      status: leaveRequests.status,
      adminComment: leaveRequests.adminComment,
      attachmentPath: leaveRequests.attachmentPath,
      createdAt: leaveRequests.createdAt,
      updatedAt: leaveRequests.updatedAt,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
    })
    .from(leaveRequests)
    .innerJoin(users, eq(leaveRequests.userId, users.id))
    .orderBy(desc(leaveRequests.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ total }] = await db.select({ total: count() }).from(leaveRequests);

  return {
    leaveRequests: allLeaveRequests,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const updateLeaveRequestService = async (data: UpdateLeaveRequest) => {
  const { id, status, admin_comment } = data;

  const updatedLeaveRequest = await db
    .update(leaveRequests)
    .set({
      status,
      adminComment: admin_comment,
      updatedAt: new Date(),
    })
    .where(eq(leaveRequests.id, id))
    .returning();

  if (updatedLeaveRequest.length === 0) {
    throw new Error("Leave request not found");
  }

  return updatedLeaveRequest[0];
};
