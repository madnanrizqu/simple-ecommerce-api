import express from "express";
import {
  getMeHandler,
  getUserHandler,
  getUsersHandler,
  updateUserHandler,
} from "../controllers/user.controller";
import { deserializeUser } from "../../middlewares/deserializeUser";
import { requireUser } from "../../middlewares/requireUser";
import { onlyAdminRole } from "../../middlewares/onlyAdminRole";
import { validate } from "../../middlewares/validate";
import { getUserSchema, updateUserSchema } from "../schemas/user.schema";

const router = express.Router();

router.use(deserializeUser, requireUser);

router.get("/me", getMeHandler);

router.use(onlyAdminRole);

router.get("/", getUsersHandler);

router.get("/:userId", validate(getUserSchema), getUserHandler);

router.put("/:userId", validate(updateUserSchema), updateUserHandler);

export default router;
