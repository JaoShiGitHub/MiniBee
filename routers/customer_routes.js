import { Router } from "express";
// Middlewares
import { authUser } from "../middlewares/userAuth.js";
// Controllers
import {
  customerAddOrder,
  customerEditInfo,
  customerInfo,
  customerOrderHistory,
  customerDeleteOrderHistory,
} from "../controllers/customer.js";
import deleteAccount from "../controllers/deleteAccount.js";

const customerRouter = Router();

// ---- POST ----
customerRouter.post("/order", authUser, customerAddOrder);
// ---- GET ----
customerRouter.get("/info", authUser, customerInfo);
customerRouter.get("/order-history", authUser, customerOrderHistory);
// ---- EDIT ----
customerRouter.put("/edit", authUser, customerEditInfo);
// ---- DELETE ----
customerRouter.delete(
  "/delete/order-history",
  authUser,
  customerDeleteOrderHistory
);
customerRouter.delete("/delete", authUser, deleteAccount);

export default customerRouter;
