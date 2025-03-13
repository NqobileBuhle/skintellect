import { z } from "zod";


export const emailSchema = z.string().email("Invalid email");
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters, got it!");

// User registration schema
export const registerSchema = z.object({
  username: z
  .string()
  .min(10, "Username must be at least 10 characters"),

  email: z
  .string()
  .email("Invalid email format"),

  password: z
  .string()
  .min(8, "Password must be at least 8 characters"),

  role: z
  .enum(["admin", "customers"]).default("customers")
  .required(), 

  status: z
  .enum(["Active", "Inactive"])
  .optional(), 
});

// User login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

//  Update profile schema
export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["admin", "customers"]).optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});
