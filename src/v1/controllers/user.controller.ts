import { NextFunction, Request, Response } from "express";
import { generateJson } from "../../utils/genJson";
import {
  deleteUserById,
  getUserById,
  getUsers,
  updateUserById,
} from "../services/user.services";
import {
  DeleteUserParams,
  GetUserParams,
  UpdateUserBody,
  UpdateUserParams,
} from "../schemas/user.schema";
import bcrypt from "bcryptjs";

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

export const updateUserHandler = async (
  req: Request<UpdateUserParams, {}, UpdateUserBody>,
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

    const updatedUser = await updateUserById(userId, {
      contact_number: req.body.contactNumber,
      contact_number_extension: req.body.contactNumberExtension,
      name: req.body.name,
      email: req.body.email,
      ...(req.body.password
        ? {
            password: await bcrypt.hash(req.body.password, 12),
          }
        : {}),
    });

    return res.status(200).json(
      generateJson({
        code: 200,
        data: updatedUser,
      })
    );
  } catch (error) {
    next(error);
  }
};

export const deleteUserHandler = async (
  req: Request<DeleteUserParams>,
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

    await deleteUserById(userId);

    return res.status(200).json(
      generateJson({
        code: 200,
        message: "User deleted",
      })
    );
  } catch (error) {
    next(error);
  }
};
