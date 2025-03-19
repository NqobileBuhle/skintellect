import User from "../model/userModel.js";
import HttpError from "../utils/httpError.js";
import { UNAUTHORIZED, CONFLICT } from "../constants/http.codes.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

/**
 * Registers a new user.
 * @param {Object} userData - The user data for registration.
 * @returns {Promise<Object>} - The created user object.
 */
export const registerUser = async (userData) => {
  const { email, password, role } = userData;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new HttpError("Email already exists", CONFLICT);
  }

  const jwt_secret = crypto.randomBytes(32).toString("hex"); // generating a secure random secret

  // Create the user
  const user = await User.create({
    email,
    password,
    role,
    jwt_secret,
  });

  return user;
};

/**
 * Logs in a user.
 * @param {Object} credentials - The login credentials.
 * @returns {Promise<Object>} - The logged-in user object.
 */
export const loginUser = async (credentials) => {
  const { email, password } = credentials;

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPasswords(password))) {
    return next(new HttpError("Incorrect email or password"), UNAUTHORIZED);
  }
  // Check if user exists

  return user;
};