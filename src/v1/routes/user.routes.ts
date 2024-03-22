import express from "express";
import { getMeHandler, getUsersHandler } from "../controllers/user.controller";
import { deserializeUser } from "../../middlewares/deserializeUser";
import { requireUser } from "../../middlewares/requireUser";
import { onlyAdminRole } from "../../middlewares/onlyAdminRole";

const router = express.Router();

router.use(deserializeUser, requireUser);

router.get("/me", getMeHandler);

router.use(onlyAdminRole);

router.get("/", getUsersHandler);

export default router;
