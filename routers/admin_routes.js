import { Router } from "express";
import { insertMenu } from "../controllers/admin";
const admin = Router();

admin.post("/create-menu", insertMenu);

export default admin;
