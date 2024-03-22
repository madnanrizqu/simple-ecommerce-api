import { TypeOf, object, string } from "zod";

export const getUserSchema = object({
  params: object({
    userId: string(),
  }),
});

export type GetUserParams = TypeOf<typeof getUserSchema>["params"];
