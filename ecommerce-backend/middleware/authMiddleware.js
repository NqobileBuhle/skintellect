
// Middleware to check JWT
import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import asyncHandler from "express-async-handler";
import { promisify } from "util";
import HttpError from "../utils/httpError.js";
import {
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  UNAUTHORIZED,
} from "../constants/http.codes.js";

// Promisify jwt.verify
//const jwtVerify = promisify(jwt.verify);

const protect = asyncHandler(async (req, res, next) => {
  const accessToken = req.cookies.accessToken; // Check for access token cookie

  if (!accessToken) {
    return next(new HttpError("Not authorized, no token", UNAUTHORIZED));
  }

  // Decode the token (without verifying) to get the user ID
  const decoded = jwt.decode(accessToken);

  if (!decoded || !decoded.id) {
    next(
      new HttpError("Not authorized, invalid token structure", UNAUTHORIZED)
    );
  }

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    next(new HttpError("Not authorized, user not found", NOT_FOUND));
  }

  // Retrieve user's current jwt_secret from the database
  const currentJwtSecret = user.jwt_secret;

  if (!currentJwtSecret) {
    next(
      new HttpError(
        "Server error: User jwt_secret missing",
        INTERNAL_SERVER_ERROR
      )
    );
  }

  // Verify the access token against the user's current jwt_secret
  try {
    jwt.verify(accessToken, currentJwtSecret); // Use user's jwt_secret for verification
    req.user = user; // Attach user to request object
    next(); // Proceed to the next middleware or route handler
  } catch (verificationError) {
    return next(new HttpError("Not authorized, invalid token", UNAUTHORIZED));
  }
});

// Middleware to authorize based on user roles
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new HttpError("Not authorized", FORBIDDEN));
    }
    next(); // Proceed to the next middleware or route handler
  };
};

export { protect, authorizeRoles };
