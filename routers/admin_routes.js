import { Router } from "express";
import { getOrders, getOrdersByCustomerID } from "../controllers/order.js";
import { getAdminById, getAdmins } from "../controllers/admin.js";
import { getCustomers } from "../controllers/customer.js";
import { isAdmin, authUser } from "../middlewares/userAuth.js";

const adminRouter = Router();
const adminMiddleware = [authUser, isAdmin];

adminRouter.get("/", adminMiddleware, getAdmins);
adminRouter.get("/info", adminMiddleware, getAdminById);
adminRouter.get("/customers", adminMiddleware, getCustomers);
adminRouter.get(
  "/customer-orders/:customer_id",
  adminMiddleware,
  getOrdersByCustomerID
);
adminRouter.get("/orders", adminMiddleware, getOrders);

export default adminRouter;
