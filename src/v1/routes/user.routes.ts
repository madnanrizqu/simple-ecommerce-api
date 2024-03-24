import express from "express";
import {
  deleteUserHandler,
  getMeHandler,
  getUserHandler,
  getUsersHandler,
  getUsersTotalHandler,
  updateUserHandler,
} from "../controllers/user.controller";
import { deserializeUser } from "../../middlewares/deserializeUser";
import { requireUser } from "../../middlewares/requireUser";
import { onlyAdminRole } from "../../middlewares/onlyAdminRole";
import { validate } from "../../middlewares/validate";
import {
  deleteUserSchema,
  getUserSchema,
  getUsersSchema,
  updateUserSchema,
} from "../schemas/user.schema";

const router = express.Router();

router.use(deserializeUser, requireUser);

router.get("/me", getMeHandler);

router.use(onlyAdminRole);

router.get("/", validate(getUsersSchema), getUsersHandler);

router.get("/total", getUsersTotalHandler);

router.get("/:userId", validate(getUserSchema), getUserHandler);

router.put("/:userId", validate(updateUserSchema), updateUserHandler);

router.delete("/:userId", validate(deleteUserSchema), deleteUserHandler);

export default router;
