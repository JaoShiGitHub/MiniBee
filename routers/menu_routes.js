import { Router } from "express";
import {
  createMenu,
  editMenu,
  getMenu,
  deleteMenu,
} from "../controllers/menu.js";
import { authUser, isAdmin } from "../middlewares/userAuth.js";

const menuRouter = Router();
const adminMiddleware = [authUser, isAdmin];

menuRouter.get("/", authUser, getMenu);
// --v-- ADMIN ONLY --v--
menuRouter.post("/create", adminMiddleware, createMenu);
menuRouter.put("/edit", adminMiddleware, editMenu);
menuRouter.delete("/delete/:menu_id", adminMiddleware, deleteMenu);

export default menuRouter;
