import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authUser.js";
import {
  checkUserConflict,
  validateLoginUser,
  validateRegisterUser,
} from "../middlewares/userValidation.js";
import checkLogin from "../controllers/check_login.js";
import { authUser } from "../middlewares/userAuth.js";
const authRouter = Router();

authRouter.post(
  "/register",
  [validateRegisterUser, checkUserConflict],
  registerUser
);
authRouter.post("/login", validateLoginUser, loginUser);
authRouter.post("/logout", logoutUser);

authRouter.get("/check-login", authUser, checkLogin);

export default authRouter;
