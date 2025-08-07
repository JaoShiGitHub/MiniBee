import { Router } from "express";
import { adminLogin, adminRegister } from "../controllers/admin.js";
import { insertMenu } from "../controllers/menu.js";

const admin = Router();

admin.post("/register", adminRegister);
admin.post("/login", adminLogin);
admin.post("/newmenu", insertMenu);

export default admin;
