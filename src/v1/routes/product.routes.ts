import express from "express";
import { deserializeUser } from "../../middlewares/deserializeUser";
import { requireUser } from "../../middlewares/requireUser";
import {
  createProductHandler,
  getProductHandler,
  getProductsHandler,
  updateProductHandler,
} from "../controllers/product.controller";
import { onlyAdminRole } from "../../middlewares/onlyAdminRole";
import { validate } from "../../middlewares/validate";
import {
  createProductSchema,
  getProductSchema,
  updateProductSchema,
} from "../schemas/product.schema";

const router = express.Router();

router.use(deserializeUser, requireUser);

router.get("/", getProductsHandler);

router.use(onlyAdminRole);

router.post("/", validate(createProductSchema), createProductHandler);

router.get("/:productId", validate(getProductSchema), getProductHandler);

router.put("/:productId", validate(updateProductSchema), updateProductHandler);

export default router;
