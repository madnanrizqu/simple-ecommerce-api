import express from "express";
import { deserializeUser } from "../../middlewares/deserializeUser";
import { requireUser } from "../../middlewares/requireUser";
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  getProductsHandler,
  updateProductHandler,
} from "../controllers/product.controller";
import { onlyAdminRole } from "../../middlewares/onlyAdminRole";
import { validate } from "../../middlewares/validate";
import {
  createProductSchema,
  deleteProductSchema,
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

router.delete(
  "/:productId",
  validate(deleteProductSchema),
  deleteProductHandler
);

export default router;
