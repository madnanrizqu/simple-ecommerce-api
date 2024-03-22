import { NextFunction, Request, Response } from "express";
import { generateJson } from "../../utils/genJson";
import { getProducts } from "../services/product.services";

export const getProductsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return res.status(200).json(
      generateJson({
        code: 200,
        data: {
          products: await getProducts(),
        },
      })
    );
  } catch (error) {
    next(error);
  }
};
