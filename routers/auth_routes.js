import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authUser.js";
import {
  checkUserConflict,
  validateLoginCustomer,
  validateRegisterCustomer,
} from "../middlewares/customerValidation.js";
import checkLogin from "../controllers/check_login.js";
import { authUser } from "../middlewares/userAuth.js";
const authRouter = Router();

authRouter.post(
  "/register",
  [validateRegisterCustomer, checkUserConflict],
  registerUser
);
authRouter.post("/login", validateLoginCustomer, loginUser);
authRouter.post("/logout", logoutUser);

authRouter.get("/check-login", authUser, checkLogin);

export default authRouter;
