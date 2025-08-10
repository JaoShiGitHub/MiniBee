import { Router } from "express";
import { getOrders } from "../controllers/order";
const admin = Router();

admin.post("/orders", getOrders);

export default admin;
