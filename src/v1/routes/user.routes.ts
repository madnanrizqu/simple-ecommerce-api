import express from "express";
import { getMeHandler } from "../controllers/user.controller";
import { deserializeUser } from "../../middewares/deserializeUser";
import { requireUser } from "../../middewares/requireUser";

const router = express.Router();

router.use(deserializeUser, requireUser);

router.get("/me", getMeHandler);

export default router;
