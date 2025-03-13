import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter email"],
      unique: true,
      trim: true, // Trim whitespace
      lowercase: true, // Store emails in lowercase
    },
    password: {
      type: String,
      required: [true, " Enter Password"],
    },
    jwt_secret: {
      type: String,
      required: true, // Ensure this field is always present
    },
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin"], // Restrict to valid roles
    },
    refreshToken: {
      // ADD THIS
      type: String, // Store the refresh token
      default: null, // Initially, no refresh token
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt timestamps
  }
);

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
});

// Method to omit specified fields from the user object
userSchema.methods.omitField = function (fields) {
  const user = this.toObject(); // Convert Mongoose document to plain JavaScript object

  // Ensure fields is an array
  const fieldsToOmit = Array.isArray(fields) ? fields : [fields];

  fieldsToOmit.forEach((field) => {
    delete user[field]; // Delete each specified field
  });

  return user; // Return the modified object without the omitted fields
};

// Method to compare entered password with the stored hash
userSchema.methods.comparePasswords = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;