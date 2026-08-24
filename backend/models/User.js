import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    phone: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    otp: String,
    otpExpiry: Date,
    isVarified: {
      type: Boolean,
      default: false,
    },
    department: String,
    stream: String,
    semester: String,
    year: String,
    roolNo: String,
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    studentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("user", userSchema);
