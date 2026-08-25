import express from "express";
import {
  authenticationToken,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import { searchStudentByRoll } from "../controllers/studentController.js";

const studentRouter = express.Router();

studentRouter.get(
  "/search-by-rool",
  authenticationToken,
  authorizeRoles("admin"),
  searchStudentByRoll,
);

export default studentRouter;
