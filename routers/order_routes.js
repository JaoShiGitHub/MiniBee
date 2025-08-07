import { Router } from "express";
import { deleteOrderHistory, orderHistory } from "../controllers/order.js";
import authUser from "../middlewares/auth.js";

const order = Router();

order.get("/history", authUser, orderHistory);
order.delete("/delete", authUser, deleteOrderHistory);

export default order;
