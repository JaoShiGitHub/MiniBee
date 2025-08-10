import { Router } from "express";
import { getOrders, getOrdersByCustomerID } from "../controllers/order.js";
import { getAdmins } from "../controllers/admin.js";
import { getCustomers } from "../controllers/customer.js";
const admin = Router();

admin.get("/", getAdmins);
admin.get("/customers", getCustomers);
admin.get("/customer-orders", getOrdersByCustomerID);
admin.post("/orders", getOrders);

export default admin;
