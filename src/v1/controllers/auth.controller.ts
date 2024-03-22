import { CookieOptions, NextFunction, Request, Response } from "express";
import config from "config";
import { generateJson } from "../../utils/genJson";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  createUser,
  findUniqueUser,
  updateUser,
} from "../services/auth.services";
import {
  LoginUserBody,
  RegisterUserBody,
  VerifyEmailParams,
} from "../schemas/auth.schema";
import Email from "../../utils/email";
import AppError from "../../utils/appError";
import { signTokens } from "../../utils/jwt";

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
};

if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000, // config number * 1 minute
};

export const registerUserHandler = async (
  req: Request<{}, {}, RegisterUserBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const verifyCode = crypto.randomBytes(32).toString("hex");
    const verificationCode = crypto
      .createHash("sha256")
      .update(verifyCode)
      .digest("hex");

    const user = await createUser({
      name: req.body.name,
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      email_verification_code: verificationCode,
      contact_number: req.body.contactNumber,
      contact_number_extension: req.body.contactNumberExtension,
      role: req.body.role,
    });

    const redirectUrl = `${config.get<string>(
      "frontendUrl"
    )}/verify_email/${verifyCode}`;
    try {
      const devEmailLink = await new Email(
        user,
        redirectUrl
      ).sendVerificationCode();

      res.status(201).json({
        status: "success",
        message:
          "An email with a verification code has been sent to your email",
        data: {
          devEmailLink: devEmailLink as string,
        },
      });
    } catch (error) {
      await updateUser({ id: user.id }, { email_verification_code: undefined });
      return res.status(500).json({
        status: "error",
        message: "There was an error sending email, please try again",
      });
    }
  } catch (err: any) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(409).json({
          status: "fail",
          message:
            "Email or contact number already exist, please provide another one",
        });
      }
    }
    next(err);
  }
};

export const verifyEmailHandler = async (
  req: Request<VerifyEmailParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const verificationCode = crypto
      .createHash("sha256")
      .update(req.params.emailVerificationCode)
      .digest("hex");

    const user = await updateUser(
      { email_verification_code: verificationCode },
      { email_verified: true, email_verification_code: undefined },
      { email: true }
    );

    if (!user) {
      return next(new AppError(401, "Could not verify email"));
    }

    res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(403).json({
        status: "fail",
        message: `Verification code is invalid or user doesn't exist`,
      });
    }
    next(err);
  }
};

export const loginUserHandler = async (
  req: Request<{}, {}, LoginUserBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await findUniqueUser(
      { email: email.toLowerCase() },
      { id: true, email: true, email_verified: true, password: true }
    );

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(new AppError(400, "Invalid email or password"));
    }

    // Check if user is verified
    if (!user.email_verified) {
      return next(
        new AppError(
          401,
          "You are not verified, please verify your email to login"
        )
      );
    }

    // Sign Tokens
    const { access_token } = await signTokens(user);
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    res.status(200).json(
      generateJson({
        code: 200,
        data: {
          access_token,
        },
      })
    );
  } catch (err: any) {
    next(err);
  }
};

export const logoutUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("logged_in", "", { maxAge: 1 });

    res.status(200).json(
      generateJson({
        code: 200,
      })
    );
  } catch (err: any) {
    next(err);
  }
};
