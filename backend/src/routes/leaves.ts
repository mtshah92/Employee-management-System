import { Router } from "express";
import {
  createLeaveRequest,
  getMyLeaveRequests,
  getAllLeaveRequests,
  updateLeaveRequest,
} from "../controllers/leave.controller";
import { authenticate, authorize } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

/**
 * @swagger
 * /api/leaves:
 *   post:
 *     summary: Create a new leave request
 *     tags: [Leave Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - leave_type
 *               - start_date
 *               - end_date
 *               - reason
 *             properties:
 *               leave_type:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               reason:
 *                 type: string
 *               attachment:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Leave request created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticate, upload.single("attachment"), createLeaveRequest);

/**
 * @swagger
 * /api/leaves/my:
 *   get:
 *     summary: Get current user's leave requests
 *     tags: [Leave Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of user's leave requests
 *       401:
 *         description: Unauthorized
 */
router.get("/my", authenticate, getMyLeaveRequests);

/**
 * @swagger
 * /api/leaves:
 *   get:
 *     summary: Get all leave requests (Admin only)
 *     tags: [Leave Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of all leave requests
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get("/", authenticate, authorize(["admin"]), getAllLeaveRequests);

/**
 * @swagger
 * /api/leaves/{id}:
 *   put:
 *     summary: Update leave request status (Admin only)
 *     tags: [Leave Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *               admin_comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Leave request updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Leave request not found
 */
router.put("/:id", authenticate, authorize(["admin"]), updateLeaveRequest);

export default router;
