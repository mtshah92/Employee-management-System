import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { leaveRequestSchema, updateLeaveSchema } from "../utils/validation";

import {
  createLeaveRequestService,
  getMyLeaveRequestsService,
  getAllLeaveRequestsService,
  updateLeaveRequestService,
} from "../services/leave.service";
import { sendLeaveStatusNotification } from "../services/email.service";
import { db } from "../database/connection";
import { leaveRequests, users } from "../database/schema";
import { eq } from "drizzle-orm";

export const createLeaveRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { error } = leaveRequestSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const leaveRequest = await createLeaveRequestService({
      userId: req.user!.id,
      leave_type: req.body.leave_type,
      start_date: req.body.start_date,
      end_date: req.body.end_date,
      reason: req.body.reason,
      attachment_path: req.file?.path,
    });

    return res.status(201).json({
      message: "Leave request created successfully",
      leaveRequest,
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getMyLeaveRequests = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getMyLeaveRequestsService(req.user!.id, page, limit);

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllLeaveRequests = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getAllLeaveRequestsService(page, limit);

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateLeaveRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { error } = updateLeaveSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const leaveRequest = await updateLeaveRequestService({
      id: parseInt(req.params.id),
      status: req.body.status,
      admin_comment: req.body.admin_comment,
    });

    // Send email notification
    try {
      // Fetch leave request with user details for email
      const [leaveWithUser] = await db
        .select({
          id: leaveRequests.id,
          leaveType: leaveRequests.leaveType,
          startDate: leaveRequests.startDate,
          endDate: leaveRequests.endDate,
          reason: leaveRequests.reason,
          status: leaveRequests.status,
          adminComment: leaveRequests.adminComment,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
        })
        .from(leaveRequests)
        .innerJoin(users, eq(leaveRequests.userId, users.id))
        .where(eq(leaveRequests.id, parseInt(req.params.id)));

      if (leaveWithUser) {
        await sendLeaveStatusNotification(
          leaveWithUser as any,
          leaveWithUser.email,
          `${leaveWithUser.firstName} ${leaveWithUser.lastName}`,
          req.body.status,
          req.body.admin_comment
        );
      }
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // Don't fail the request if email fails
    }

    return res.json({
      message: "Leave request updated successfully",
      leaveRequest,
    });
  } catch (err: any) {
    if (err.message === "Leave request not found") {
      return res.status(404).json({ error: err.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};
