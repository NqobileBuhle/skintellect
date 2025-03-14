
import jwt from "jsonwebtoken";

/**
 * Generates a short-lived access token.
 * @param {Object} user - The user object containing user details.
 */
const generateAccessToken = (user) => {
  const jwtOptions = {
    expiresIn: "15m", // Short-lived access token
    issuer: "Kat.com",
    audience: "API V1",
  };
  return jwt.sign(
    {
      id: user._id,
    },
    user.jwt_secret,
    jwtOptions
  );
};

export default generateAccessToken;
