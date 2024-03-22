import { TypeOf, number, object, optional, string } from "zod";

export const createProductSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    price: number({
      required_error: "Price is required",
    }),
    currency: string({
      required_error: "Currency is required",
    }),
  }),
});

export type CreateProductBody = TypeOf<typeof createProductSchema>["body"];

export const getProductSchema = object({
  params: object({
    productId: string(),
  }),
});

export type GetProductParams = TypeOf<typeof getProductSchema>["params"];

export const updateProductSchema = object({
  params: object({
    productId: string(),
  }),
  body: object({
    name: optional(string()),
    price: optional(number()),
    currency: optional(string()),
  }).refine(
    (obj) => {
      for (const val of Object.values(obj)) {
        if (val !== undefined) return true;
      }
      return false;
    },
    {
      message: "Must have at least one property defined",
    }
  ),
});

export type UpdateProductBody = TypeOf<typeof updateProductSchema>["body"];
export type UpdateProductParams = TypeOf<typeof updateProductSchema>["params"];

export const deleteProductSchema = object({
  params: object({
    productId: string(),
  }),
});

export type DeleteProductParams = TypeOf<typeof deleteProductSchema>["params"];

export const getProductsSchema = object({
  query: optional(
    object({
      skip: optional(string().refine((v) => !isNaN(Number(v)))),
      take: optional(string().refine((v) => !isNaN(Number(v)))),
    })
  ),
});

export type GetProductsQuery = TypeOf<typeof getProductsSchema>["query"];
