import { NextFunction, Request, Response } from "express";
import { generateJson } from "../../utils/genJson";
import { getUsers } from "../services/user.services";
import { UserSanitized } from "../schemas/auth.schema";

export const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    res.status(200).json(
      generateJson({
        code: 200,
        data: {
          user,
        },
      })
    );
  } catch (err: any) {
    next(err);
  }
};

export const getUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user as UserSanitized;

    if (user.role !== "ADMIN") {
      return res.status(401).json(
        generateJson({
          code: 401,
          message: "You are not allowed to this operation",
        })
      );
    }

    return res.status(200).json(
      generateJson({
        code: 200,
        data: {
          users: await getUsers(),
        },
      })
    );
  } catch (error) {
    next(error);
  }
};
