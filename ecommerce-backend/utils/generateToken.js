import { JWT_SECRET, NODE_ENV } from "../constants/env.const.js";
import { after30Days } from "../constants/date.const.js";
import generateAccessToken from "./generateAccessToken.js";
import generateRefreshToken from "./generateRefreshToken.js";

const accessCookieOptions = () => ({
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "strict",
  expires: after30Days(),
  path: "/api/",
});

const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "strict",
  expires: after30Days(),
  path: "/api/auth/refresh", 
});

const setAuthCookies = (res, accessToken, refreshToken) => {
  if (!res.headersSent) {
    res.cookie("accessToken", accessToken, accessCookieOptions());
    res.cookie("refreshToken", refreshToken, refreshCookieOptions());
  } else {
    console.error("Headers already sent; cannot set cookies.");
  }
};

const generateToken = async (userId, res) => {
  try {
    const accessToken = generateAccessToken(userId);
    const refreshToken = await generateRefreshToken(userId);

    userId.refreshToken = refreshToken;
    await userId.save();

    setAuthCookies(res, accessToken, refreshToken);
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new Error("Failed to generate tokens");
  }
};

export default generateToken;
