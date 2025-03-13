import asyncHandler from "express-async-handler";
import {
  CONFLICT,
  CREATED,
  FORBIDDEN,
  OK,
  UNAUTHORIZED,
} from "../constants/http.codes.js";
import HttpError from "../utils/httpError.js";
import generateToken from "../utils/generateToken.js";
import { loginUser, registerUser } from "../service/authService.js";
import { clearAuthCookies } from "../utils/authCookies.js";
import User from "../model/userModel.js";

/**
 * Handles user registration.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

const registerHandler = asyncHandler(async (req, res, next) => {
  //validation middleware is called first, then service
  const user = await registerUser(req.body);

  await generateToken(user, res);

  //
  const data = new User(user).omitField(["jwt_secret", "password"]);

  res.status(CREATED).json({
    status: "User succefully registered",
    data,
  });
});

/**
 * Handles user registration.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */

const loginHandler = asyncHandler(async (req, res, next) => {
  const user = await loginUser(req.body); //using login Service

  const { accessToken, refreshToken } = await generateToken(user, res);

  const data = new User(user).omitField(["jwt_secret", "password"]);

  res.status(200).json({
    status: "User successfully logged alright",
    accessToken,
    refreshToken,
    role: user.role,
  });
});

const logoutHandler = asyncHandler(async (req, res, next) => {
  clearAuthCookies(res);
  res.status(OK).json({
    status: "Logout Handler",
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // Assuming you store the refresh token in a cookie

  if (!refreshToken) {
    return res.status(UNAUTHORIZED).json({
      message: "Refresh token missing",
    }); // Missing refresh token
  }

  // Fetch the user from the database and check the refresh token
  const user = await User.findOne({
    refreshToken,
  });

  if (!user) {
    return res.status(FORBIDDEN).json({
      message: "Invalid refresh token",
    }); // Invalid refresh token or token not found for user
  }

  // Generate new access token and refresh token
  const accessToken = generateAccessToken(user);
  const newRefreshToken = await generateRefreshToken(user);

  // Update the user's refresh token in the database
  user.refreshToken = newRefreshToken;
  await user.save();

  // Set the new tokens as HTTP-only cookies
  setAuthCookies(res, accessToken, newRefreshToken);

  res.status(200).json({
    message: "Tokens refreshed successfully",
  });
});

export { loginHandler, registerHandler, logoutHandler };