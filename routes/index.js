import express from "express";

const router = express.Router();
import { loginController, refreshController, registerController, userController } from "../controller";
import auth from "../middleware/auth";

router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.get("/me", auth, userController.me);
router.post("/refresh", refreshController.refresh);
router.post("/logout",auth, loginController.logout);


export default router;
