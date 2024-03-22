import { user_status } from "@prisma/client";
import { TypeOf, object, optional, string, z } from "zod";

export const getUserSchema = object({
  params: object({
    userId: string(),
  }),
});

export type GetUserParams = TypeOf<typeof getUserSchema>["params"];

export const updateUserSchema = object({
  params: object({
    userId: string(),
  }),
  body: object({
    name: optional(string()),
    email: optional(string().email("Invalid email address")),
    contactNumber: optional(string()),
    contactNumberExtension: optional(string()),
    password: optional(
      string()
        .min(6, "Password must be more than 6 characters")
        .max(32, "Password must be less than 32 characters")
    ),
    status: optional(z.nativeEnum(user_status)),
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

export type UpdateUserParams = TypeOf<typeof updateUserSchema>["params"];
export type UpdateUserBody = TypeOf<typeof updateUserSchema>["body"];
