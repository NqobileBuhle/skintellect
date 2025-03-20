const generateToken = async (userId, res) => {
  try {
    const accessToken = generateAccessToken(userId);
    const refreshToken = await generateRefreshToken(userId);

    // Find the user and update the refresh token
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found while generating tokens");
    }

    user.refreshToken = refreshToken;
    await user.save();

    setAuthCookies(res, accessToken, refreshToken);
    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new Error("Failed to generate tokens");
  }
};
export default generateToken;