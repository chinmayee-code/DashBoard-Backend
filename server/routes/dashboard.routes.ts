import { Router } from "express";
import { dashBoardController } from "../controllers";

const router = Router();

router.get("/barchat", dashBoardController.getBarChat);
router.get("/data", dashBoardController.getBarChat);

export default router;
