import User from "../models/User";
import { generate } from "otp-generator";
import sendOtp from "../utils/sendOTP";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { useReducer } from "react";

export async function registerUser(req, res) {
  try {
    const { name, email, phone, password } = req.body;
    if (!email)
      return res.status(400).json({
        message: "Email is required",
      });

    const cleanPhone = phone ? phone.toString().replace(/\D/g, "") : "";
    if (cleanPhone.length !== 11) {
      return res.status(400).json({
        message: "Mobile number must be exactly of 11 digits",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVarified)
        return res.status(400).json({
          message: "User alrady exists",
        });
      await User.deleteOne({ email });
    }

    const otp = generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    try {
      await sendOtp(email, otp);
    } catch (emailError) {
      console.log("Error sending OTP email:", emailError);
      return res.status(500).json({
        message: "Failed to send OTP email.Please try again",
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);
    const otpExpiry = new Date(Date.new() + 5 * 60 * 1000);
    const studentId = `ST-${uuidv4().slice(0, 8).toUpperCase()}`;

    const user = await User.create({
      name,
      email,
      phone: cleanPhone,
      password: hashedpassword,
      otp,
      otpExpiry,
      studentId,
    });
    res.status(201).json({
      message: "User registered successfully,OTP sent to email",
      user,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
}

// step 2: otp verify

export async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp || new Date() > new Date(user.otpExpiry)) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }
    Object.assign(user, { isVarified: true, otp: null, otpExpiry: null });
    await user.save();
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error verifing OTP:", error);
    res.status(500).json({
      message: "Error verifying OTP",
      error: error.message,
    });
  }
}

// step 3: complete profile

export async function completeProfile(req, res) {
  try {
    const { email, department, stream, semester, year, rollNo } = req.body;
    if (!email)
      return req.status(400).json({
        message: "Email is required",
      });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.isVarified)
      return res.status(400).json({
        message: "User not verified",
      });

    Object.assign(user, {
      department,
      stream,
      semester,
      year,
      rollNo,
      isProfileComplete: true,
    });

    await user.save();
    res.status(200).json({
      message: "Profile completed successfull",
    });
  } catch (error) {
    console.error("Error completing profile:", error);
    res.status(500).json({
      message: "Error completing profile",
      error: error.message,
    });
  }
}

// user login

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.isVarified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email with OTP",
      });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: "Inval",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    const { password: _, ...userResponse } = user.toObject();
    res.status(200).json({
      success: true,
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Error during login", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// get current user profile

export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select("password");

    if (!user) return req.status(404).json({ message: "User not found" });
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user profile", error);
    res.status(500).json({
      message: "Error fetching user profile",
      error: error.message,
    });
  }
}

