import express from "express";
import { deserializeUser } from "../../middlewares/deserializeUser";
import { requireUser } from "../../middlewares/requireUser";
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  getProductsHandler,
  getProductsTotalHandler,
  getPublicProductsHandler,
  updateProductHandler,
} from "../controllers/product.controller";
import { onlyAdminRole } from "../../middlewares/onlyAdminRole";
import { validate } from "../../middlewares/validate";
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  getProductsSchema,
  updateProductSchema,
} from "../schemas/product.schema";

const router = express.Router();

router.get("/public", validate(getProductsSchema), getPublicProductsHandler);

router.use(deserializeUser, requireUser);

router.use(onlyAdminRole);

router.get("/", validate(getProductsSchema), getProductsHandler);

router.post("/", validate(createProductSchema), createProductHandler);

router.get("/total", getProductsTotalHandler);

router.get("/:productId", validate(getProductSchema), getProductHandler);

router.put("/:productId", validate(updateProductSchema), updateProductHandler);

router.delete(
  "/:productId",
  validate(deleteProductSchema),
  deleteProductHandler
);

export default router;
