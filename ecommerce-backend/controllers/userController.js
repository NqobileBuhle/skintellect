import { loginSchema, registerSchema } from "../schemas/authSchema.js";
// import {updateUserSchema} from "../schemas/updateUserSchema.js";
import User from "../model/userModel.js";
import asyncHandler from "express-async-handler";

// Login
export const userAuth = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400);
    throw new Error(parsed.error.issues[0].message);
  }

  const { email, password } = parsed.data;
  const user = await user.findOne({ email });

  if (!User) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await User.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  generateToken(res, User._id);

  res.status(200).json({
    _id: User._id,
    email: User.email,
    username: User.username,
    role: User.role,
    status: User.status,
  });
});

// register user
export const registerUser = asyncHandler(async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.issues[0].message,
        stack: new Error(parsed.error.issues[0].message).stack,
      });
      return;
    }

    const { email, username, password, role, status } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        message: "Email is already in use",
        stack: new Error("Email is already in use").stack,
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
      role,
      status,
    });

    if (newUser) {
      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        status: newUser.status,
      });
    } else {
      res.status(400).json({
        message: "Failed to create user",
        stack: new Error("Failed to create user").stack,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }
});

//update user
export const updateUserProfile = asyncHandler(async (req, res) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400);
    throw new Error(parsed.error.issues[0].message);
  }

  const user = await user.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { email, username, password, role, status } = parsed.data;

  if (email) user.email = email;
  if (username) user.username = username;
  if (role) user.role = role;
  if (status) user.status = status;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    email: updatedUser.email,
    username: updatedUser.username,
    role: updatedUser.role,
    status: updatedUser.status,
  });
});


