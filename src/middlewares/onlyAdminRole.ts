import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import { UserSanitized } from "../v1/schemas/auth.schema";

export const onlyAdminRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user as UserSanitized;

    if (user.role !== "ADMIN") {
      return next(new AppError(401, `You are not allowed to this operation`));
    }

    next();
  } catch (err: any) {
    next(err);
  }
};
