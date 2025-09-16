import { db } from "../database/connection";
import { users } from "../database/schema";
import { CreateUserRequest, LoginRequest } from "../types";
import { generateToken, hashPassword, comparePassword } from "../utils/auth";
import { eq } from "drizzle-orm";

export const registerUser = async (data: CreateUserRequest) => {
  const { email, password, first_name, last_name, role = "employee" } = data;

  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
      firstName: first_name,
      lastName: last_name,
      role,
    })
    .returning({
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
    });

  const token = generateToken(user);

  return { user, token };
};

export const loginUser = async (data: LoginRequest) => {
  const { email, password } = data;

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) throw new Error("Invalid credentials");

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) throw new Error("Invalid credentials");

  const token = generateToken(user);

  return { user, token };
};
