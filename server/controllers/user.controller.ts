import { RequestHandler } from "express";
import { userService } from "../services";
import { prisma } from "../configs";

export const userController: {
  create: RequestHandler;
  login: RequestHandler;
  changePassword: RequestHandler;
  update: RequestHandler;
  self: RequestHandler;
} = {
  async create(req, res, next) {
    try {
      await userService.createUser(req.body);
      res.json({
        success: true,
        message: `Registration was successful. Thank you for signing up.`,
      });
    } catch (error) {
      next(error);
    }
  },
  async login(req, res, next) {
    try {
      const user = await userService.loginUser(req.body);
      const { data, token } = user;
      const { password, ...rest } = data;
      res.json({
        success: true,
        message: `Login successful`,
        data: {
          token,
          user: rest,
        },
      });
    } catch (error) {
      next(error);
    }
  },
  async changePassword(req, res, next) {
    try {
      const userId = req?.user?.id;
      const { oldPassword, newPassword } = req.body;
      await userService.changeUserPassword({
        userId: userId as string,
        oldPassword: oldPassword as string,
        newPassword: newPassword as string,
      });
      res.json({
        success: true,
        message: `Password changed successfully`,
      });
    } catch (error) {
      next(error);
    }
  },
  async self(req, res, next) {
    try {
      const userId = req.user?.id;
      const user = await userService.selfData(userId);
      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
  async update(req, res, next) {
    try {
      const { id } = req.params;
      await userService.updateUser(req.body, id);
      res.json({
        success: true,
        message: `Account updated successfully`,
      });
    } catch (error) {
      next(error);
    }
  },
};
