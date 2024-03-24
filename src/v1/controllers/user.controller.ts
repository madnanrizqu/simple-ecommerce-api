import { NextFunction, Request, Response } from "express";
import { generateJson } from "../../utils/genJson";
import {
  deleteUserById,
  getUserById,
  getUsers,
  getUsersTotal,
  updateUserById,
} from "../services/user.services";
import {
  CreateUserBody,
  DeleteUserParams,
  GetUserParams,
  GetUsersQuery,
  UpdateUserBody,
  UpdateUserParams,
} from "../schemas/user.schema";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { createUser } from "../services/auth.services";
import { omit } from "lodash";
import { userSensitiveExcludedFields } from "../schemas/auth.schema";

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
  req: Request<{}, {}, {}, GetUsersQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const args = {
      ...(req.query?.skip ? { skip: Number(req.query.skip) } : {}),
      ...(req.query?.take ? { take: Number(req.query.take) } : {}),
      ...(req.query?.name ? { name: req.query.name } : {}),
    };

    const data = await getUsers(args);

    return res.status(200).json(
      generateJson({
        code: 200,
        data: {
          users: data.res,
          total: data.count,
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
      role: req.body.role,
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

export const getUsersTotalHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resDeleted = await getUsersTotal({ deleted: true });
    const resNotDeleted = await getUsersTotal({ deleted: false });

    return res.status(200).json(
      generateJson({
        code: 200,
        data: {
          deleted: resDeleted,
          notDeleted: resNotDeleted,
          total: resDeleted + resNotDeleted,
        },
      })
    );
  } catch (error) {
    next(error);
  }
};

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const user = await createUser({
      password: hashedPassword,
      contact_number: req.body.contactNumber,
      contact_number_extension: req.body.contactNumberExtension,
      email: req.body.email,
      name: req.body.email,
      role: req.body.role,
      email_verified: true,
    });

    return res.status(200).json(
      generateJson({
        code: 200,
        data: {
          user: omit(user, userSensitiveExcludedFields),
        },
      })
    );
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(409).json({
          status: "fail",
          message:
            "Email or contact number already exist, please provide another one",
        });
      }
    }
    next(error);
  }
};
