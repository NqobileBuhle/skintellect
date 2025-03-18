import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
} from "../controllers/authController.js";
import validateRegister from "../middleware/validateRegister.js";
import validateLogin from "../middleware/validateLogin.js";
import { protect } from "../middleware/authMiddleware.js";

const authRouter = Router();

authRouter.post("/register", validateRegister, registerHandler);
authRouter.post("/login", validateLogin, loginHandler);
authRouter.get("/logout", protect, logoutHandler);

export default authRouter;