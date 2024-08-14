import { Prisma } from "@prisma/client";
import { configs, prisma } from "../configs";
import {
  Conflict,
  Forbidden,
  NotFound,
  Unauthorized,
  NotAcceptable,
} from "http-errors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userService = {
  async createUser(inputData: Prisma.UserCreateInput) {
    const isEmailExists = await prisma.user.findFirst({
      where: {
        email: inputData.email,
      },
    });
    if (isEmailExists) throw new Conflict("Email already exists!");
    const { password, ...rest } = inputData;
    const hashedPassword = await bcrypt.hash(
      password || configs.USER_PASSWORD,
      10
    );
    const user = await prisma.user.create({
      data: {
        ...rest,
        password: hashedPassword,
      },
    });
    return user;
  },
  async loginUser(inputData: Prisma.UserCreateInput) {
    const { email, password } = inputData;
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) throw new NotFound("Invalid login attempt. User not found");
    if (user.isBlocked) throw new Forbidden("You account has blocked.");
    if (!user.isVerified)
      throw new NotAcceptable("Your email not verified yet");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Unauthorized("Invalid password");

    const token = jwt.sign({ userId: user.id }, configs.JWT_SECRET);
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date().toISOString() },
    });

    return {
      data: user,
      token,
    };
  },
  async changeUserPassword({
    userId,
    oldPassword,
    newPassword,
  }: {
    userId: string;
    oldPassword: string;
    newPassword: string;
  }) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) throw new NotFound("User not found.");
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) throw new Unauthorized("Incorrect password.");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatePassword = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
    return updatePassword;
  },
  async updateUser(inputData: Prisma.UserCreateInput, id: string) {
    const isUserExist = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!isUserExist) throw new NotFound("User not found");
    const { fcmToken, ...rest } = inputData;
    const web = fcmToken?.web;
    const ios = fcmToken?.ios;
    const android = fcmToken?.android;
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...rest,
        fcmToken: {
          web: web || isUserExist?.fcmToken?.web,
          ios: ios || isUserExist?.fcmToken?.ios,
          android: android || isUserExist?.fcmToken?.android,
        },
      },
    });
    return user;
  },
  async selfData(id: string | undefined) {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        avatarPath: true,
        role: true,
        isBlocked: true,
        isVerified: true,
        fcmToken: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) throw new NotFound("Account not found");
    return user;
  },
};
