import { Router } from "express";
import {
  createMenu,
  editMenu,
  getMenu,
  deleteMenu,
} from "../controllers/menu.js";
import authUser from "../middlewares/auth.js";

const menu = Router();

menu.get("/", getMenu);
// --v-- ADMIN ONLY --v--
menu.post("/create", createMenu);
menu.put("/edit", editMenu);
menu.delete("/delete/:menu_id", deleteMenu);

export default menu;
