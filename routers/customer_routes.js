import { Router } from "express";
// Middlewares
import { authUser } from "../middlewares/userAuth.js";
// Controllers
import {
  customerAddOrder,
  customerEditInfo,
  customerInfo,
  customerDeleteAccount,
  customerOrderHistory,
  customerDeleteOrderHistory,
} from "../controllers/customer.js";

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
customerRouter.delete("/delete", authUser, customerDeleteAccount);

export default customerRouter;
