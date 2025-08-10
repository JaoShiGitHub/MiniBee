import { Router } from "express";
import { getOrders, getOrdersByCustomerID } from "../controllers/order.js";
import { getAdmins } from "../controllers/admin.js";
import { getCustomers } from "../controllers/customer.js";

const adminRouter = Router();

adminRouter.get("/", getAdmins);
adminRouter.get("/customers", getCustomers);
adminRouter.get("/customer-orders", getOrdersByCustomerID);
adminRouter.post("/orders", getOrders);

export default adminRouter;
