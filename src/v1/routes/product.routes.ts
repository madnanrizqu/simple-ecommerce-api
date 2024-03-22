import express from "express";
import { deserializeUser } from "../../middlewares/deserializeUser";
import { requireUser } from "../../middlewares/requireUser";
import {
  createProductHandler,
  getProductsHandler,
} from "../controllers/product.controller";
import { onlyAdminRole } from "../../middlewares/onlyAdminRole";
import { validate } from "../../middlewares/validate";
import { createProductSchema } from "../schemas/product.schema";

const router = express.Router();

router.use(deserializeUser, requireUser);

router.get("/", getProductsHandler);

router.use(onlyAdminRole);

router.post("/", validate(createProductSchema), createProductHandler);

export default router;
