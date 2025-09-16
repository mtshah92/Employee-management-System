import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../types";

export const generateToken = (user: any): any => {
  const secret = process.env.JWT_SECRET as string;

  const payload = { id: user.id, email: user.email, role: user.role };

  const options: any = {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d", // <-- string | number is valid here
  };

  const token = jwt.sign(payload, secret, options);

  return token;
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};
