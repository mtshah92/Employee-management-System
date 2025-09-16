import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(2).max(50).required(),
  role: Joi.string().valid('admin', 'employee').optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const leaveRequestSchema = Joi.object({
  leave_type: Joi.string().required(),
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().min(Joi.ref('start_date')).required(),
  reason: Joi.string().min(10).max(500).required()
});

export const updateLeaveSchema = Joi.object({
  status: Joi.string().valid('approved', 'rejected').required(),
  admin_comment: Joi.string().max(500).optional()
});