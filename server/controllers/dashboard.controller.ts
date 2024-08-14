import { RequestHandler } from "express";
import { prisma } from "../configs";

export const dashBoardController: {
  getBarChat: RequestHandler;
} = {
  async getBarChat(req, res, next) {
    try {
      const { filter } = req.query;
      let data;
      if (filter === "weekly") {
        data = await prisma.cHAT_DATA.findMany({
          where: { type: "week" },
        });
      } else if (filter === "monthly") {
        data = await prisma.cHAT_DATA.findMany({
          where: { type: "month" },
        });
      } else if (filter === "yearly") {
        data = await prisma.cHAT_DATA.findMany({
          where: { type: "year" },
        });
      } else {
        data = await prisma.cHAT_DATA.findMany();
      }
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
