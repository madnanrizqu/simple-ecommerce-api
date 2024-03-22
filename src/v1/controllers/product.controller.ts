import { NextFunction, Request, Response } from "express";
import { generateJson } from "../../utils/genJson";
import {
  createProduct,
  deleteProductById,
  getProductById,
  getProducts,
  updateProductById,
} from "../services/product.services";
import {
  CreateProductBody,
  DeleteProductParams,
  GetProductParams,
  UpdateProductBody,
  UpdateProductParams,
} from "../schemas/product.schema";

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

export const getProductHandler = async (
  req: Request<GetProductParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(req.params.productId);
    return res.status(200).json(
      generateJson({
        code: 200,
        data: {
          products: await getProductById(productId),
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

export const updateProductHandler = async (
  req: Request<UpdateProductParams, {}, UpdateProductBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(req.params.productId);

    const product = await getProductById(productId);

    if (!product) {
      return res.status(404).json(
        generateJson({
          code: 404,
          message: "Product not found",
        })
      );
    }

    const updatedProduct = await updateProductById(productId, {
      currency: req.body.currency,
      price: req.body.price,
      name: req.body.name,
    });

    return res.status(200).json(
      generateJson({
        code: 200,
        data: updatedProduct,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const deleteProductHandler = async (
  req: Request<DeleteProductParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const productId = Number(req.params.productId);

    const product = await getProductById(productId);

    if (!product) {
      return res.status(404).json(
        generateJson({
          code: 404,
          message: "Product not found",
        })
      );
    }

    await deleteProductById(productId);

    return res.status(200).json(
      generateJson({
        code: 200,
        message: "Product deleted",
      })
    );
  } catch (error) {
    next(error);
  }
};
