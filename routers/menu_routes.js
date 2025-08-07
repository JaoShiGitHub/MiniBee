import { Router } from "express";
import { getMenu, insertMenu } from "../controllers/menu.js";
import authUser from "../middlewares/auth.js";

const menu = Router();

menu.get("/", authUser, getMenu);
menu.post("/insert", authUser, insertMenu);

export default menu;
