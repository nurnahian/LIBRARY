import express from "express";
import {
  completeProfile,
  getProfile,
  loginUser,
  registerAdmin,
  registerUser,
  updateProfile,
  verifyOtp,
} from "../controllers/authController.js";

import {
  authenticationToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/complete-profile", completeProfile);
authRouter.post("/login", loginUser);
authRouter.post("/register-admin", registerAdmin);

// protected routes
authRouter.get("/me", authenticationToken, getProfile);
authRouter.post("/update-profile", authenticationToken, updateProfile);
authRouter.get("/users", authenticationToken, authorizeRoles("admin"));

export default authRouter;
