import { Request, Response } from "express";
import { registerSchema, loginSchema } from "../utils/validation";
import { loginUser, registerUser } from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { user, token } = await registerUser(req.body);

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user,
    });
  } catch (err: any) {
    if (err.message === "User already exists") {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { user, token } = await loginUser(req.body);

    return res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err: any) {
    if (err.message === "Invalid credentials") {
      return res.status(401).json({ error: err.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};
