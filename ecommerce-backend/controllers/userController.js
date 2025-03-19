import { loginSchema, registerSchema } from "../schemas/authSchema.js";
import User from "../model/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { UNAUTHORIZED } from "../constants/http.codes.js";
import HttpError from "../utils/httpError.js";

// Login user
export const userAuth = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const parsed = loginSchema.safeParse(req.body);
  console.log("Login attempt for email:", email);  // Log email for debugging


  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError("Invalid email or password", UNAUTHORIZED); // Use throw to trigger the asyncHandler
  }

  // Compare entered password with the hashed password in the database
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new HttpError("Invalid email or password", UNAUTHORIZED); // Use throw for error handling
  }

  // Assuming you are generating a token here (e.g., JWT)
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
    console.log("Request body:", req.body);  // Log the request body to see what is being sent

    const parsed = registerSchema.safeParse(req.body);
    console.log("Parsed data:", parsed); // Log the result of validation

    if (!parsed.success) {
      res.status(400).json({
        message: parsed.error.issues[0].message,
      });
      return;
    }

    const { email, username, password, role, status } = parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        message: "Email is already in use",
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


