import { TypeOf, number, object, string } from "zod";

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
