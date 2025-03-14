import { loginSchema, registerSchema, updateUserSchema } from "../schemas/userSchema.js";
import User from "../model/userModel.js";

// Login
export const userAuth = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400);
    throw new Error(parsed.error.issues[0].message);
  }

  const { email, password } = parsed.data;
  const user = await user.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
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
//register user
export const registerUser = asyncHandler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400);
    throw new Error(parsed.error.issues[0].message);
  }

  const { email, username, password, role, status } = parsed.data;

  const existingUser = await user.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("Email is already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await user.create({
    email,
    username,
    password: hashedPassword,
    role,
    status,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      status: user.status,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
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


