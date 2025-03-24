import { loginSchema, registerSchema } from "../schemas/authSchema.js";
import User from "../model/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { UNAUTHORIZED } from "../constants/http.codes.js";
import HttpError from "../utils/httpError.js";
import generateToken from "../utils/generateToken.js";


// Login user
export const userAuth = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.errors });
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError("Invalid email or password", UNAUTHORIZED);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new HttpError("Invalid email or password", UNAUTHORIZED);
  }

  generateToken(res, user._id);

  res.status(200).json({
    _id: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
    status: user.status,
  });
});




// register user
export const registerUser = asyncHandler(async (req, res) => {
  try {
    console.log("Request body:", req.body); 

    // Wanted to see if password is hashed
    const parsed = registerSchema.safeParse(req.body);
    console.log("Parsed data:", parsed); 

    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0].message,
      });
    }

    const { email, username, password, role, status } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email is already in use",
      });
    }

    const newUser = await User.create({
      email,
      username,
      password, // Unhashed — hashing is handled in the model
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
    console.error("Error during registration:", error);
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


