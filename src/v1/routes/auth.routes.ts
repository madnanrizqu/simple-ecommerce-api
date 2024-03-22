import { Router } from "express";
import {
  loginUserHandler,
  logoutUserHandler,
  registerUserHandler,
  verifyEmailHandler,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", registerUserHandler);

router.get("/verify_email/:email_verification_code", verifyEmailHandler);

router.post("/login", loginUserHandler);

router.post("/logout", logoutUserHandler);

export default router;
