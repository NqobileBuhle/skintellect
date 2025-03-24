import { JWT_SECRET, NODE_ENV } from "../constants/env.const.js";
import { after90Days } from "../constants/date.const.js";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import User from "../model/userModel.js"; // Make sure this is included
import { after30Days } from "../constants/date.const.js";

// Generate access and refresh tokens, store refresh token in DB, and set cookies
const generateToken = async (user, res) => {
  try {
    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    // Store refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    // Set secure HTTP-only cookies
    setAuthCookies(res, accessToken, refreshToken);

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new Error("Failed to generate tokens");
  }
};

// Set access and refresh tokens as cookies
const setAuthCookies = (res, accessToken, refreshToken) => {
  if (!res.headersSent) {
    res.cookie("accessToken", accessToken, accessCookieOptions());
    res.cookie("refreshToken", refreshToken, refreshCookieOptions());
  } else {
    console.error("Headers already sent; cannot set cookies.");
  }
};

// Options for access token cookie
const accessCookieOptions = () => ({
  httpOnly: true,
  sameSite: "strict",
  secure: NODE_ENV === "production",
  expires: after30Days(),
  path: "/api",
});

// Options for refresh token cookie
const refreshCookieOptions = () => ({
  httpOnly: true,
  sameSite: "strict",
  secure: NODE_ENV === "production",
  expires: after30Days(),
  path: "/api/refresh",
});

export default generateToken;
