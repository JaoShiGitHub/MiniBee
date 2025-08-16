import { Router } from "express";
import { getOrders, getOrdersByCustomerID } from "../controllers/order.js";
import { editInfo, getAdminById, getAdmins } from "../controllers/admin.js";
import { getCustomers } from "../controllers/customer.js";
import { isAdmin, authUser } from "../middlewares/userAuth.js";
import deleteAccount from "../controllers/deleteAccount.js";

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
adminRouter.put("/edit-info", adminMiddleware, editInfo);
adminRouter.delete("/delete", adminMiddleware, deleteAccount);

export default adminRouter;
