import { Router } from "express";
import { dashBoardController } from "../controllers";

const router = Router();

router.get("/barchat", dashBoardController.getBarChat);
router.get("/dashboard-data", dashBoardController.getDashboardData);

export default router;
