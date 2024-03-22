import { Router } from "express";

import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import productRouter from "./product.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/products", productRouter);

export default router;
