import express from "express";
import { deserializeUser } from "../../middlewares/deserializeUser";
import { requireUser } from "../../middlewares/requireUser";
import { getProductsHandler } from "../controllers/product.controller";

const router = express.Router();

router.use(deserializeUser, requireUser);

router.get("/", getProductsHandler);

export default router;
