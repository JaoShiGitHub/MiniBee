import { Router } from "express";
import {
  createMenu,
  editMenu,
  getMenu,
  deleteMenu,
} from "../controllers/menu.js";
import authUser from "../middlewares/userAuth.js";

const menuRouter = Router();

menuRouter.get("/", getMenu);
// --v-- ADMIN ONLY --v--
menuRouter.post("/create", createMenu);
menuRouter.put("/edit", editMenu);
menuRouter.delete("/delete/:menu_id", deleteMenu);

export default menuRouter;
