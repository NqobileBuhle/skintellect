import { z } from "zod";

const updateUserSchema = z
  .object({
    email: z.string().email().optional(), // Email must be a valid email format, optional
    password: z.string().min(6).optional(), // Password must be at least 6 characters long, optional
    role: z.enum(["User", "Admin"]).optional(), // Role must be either 'User' or 'Admin', optional
  })
  .strict();

export default updateUserSchema;