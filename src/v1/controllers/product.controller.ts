import { NextFunction, Request, Response } from "express";
import { generateJson } from "../../utils/genJson";
import { createProduct, getProducts } from "../services/product.services";
import { CreateProductBody } from "../schemas/product.schema";

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

export const createProductHandler = async (
  req: Request<{}, {}, CreateProductBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await createProduct({
      name: req.body.name,
      currency: req.body.currency,
      price: req.body.price,
    });

    return res.status(200).json(
      generateJson({
        code: 200,
        data: product,
      })
    );
  } catch (error) {
    next(error);
  }
};
