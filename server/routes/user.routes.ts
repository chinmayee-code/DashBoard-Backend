import { Router } from "express";
import { userValidation } from "../validations";
import { authenticate, validate } from "../middlewares";
import { userController } from "../controllers";

const router = Router();
router.post("/", userValidation.create, validate, userController.create);

router.post("/login", userValidation.login, validate, userController.login);

router.put(
  "/change-password",
  authenticate.allUser,
  userValidation.changePassword,
  validate,
  userController.changePassword
);

router.put(
  "/:id",
  authenticate.allUser,
  userValidation.update,
  validate,
  userController.update
);

router.get("/self", authenticate.allUser, userController.self);

export default router;
