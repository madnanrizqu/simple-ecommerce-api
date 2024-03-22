import { NextFunction, Request, Response } from "express";
import { generateJson } from "../../utils/genJson";
import { getUserById, getUsers } from "../services/user.services";
import { UserSanitized } from "../schemas/auth.schema";
import { GetUserParams } from "../schemas/user.schema";

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

export const getUserHandler = async (
  req: Request<GetUserParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = Number(req.params.userId);

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json(
        generateJson({
          code: 404,
          message: "User not found",
        })
      );
    }

    return res.status(200).json(
      generateJson({
        code: 200,
        data: user,
      })
    );
  } catch (error) {
    next(error);
  }
};
