import { Router } from "express";
// Middlewares
import authUser from "../middlewares/auth.js";
import {
  checkUserConflict,
  validateLoginCustomer,
  validateRegisterCustomer,
} from "../middlewares/customer_middlewares.js";
// Controllers
import {
  customerRegister,
  customerAddOrder,
  customerEditInfo,
  customerInfo,
  customerLogin,
  customerLogout,
  customerDeleteAccount,
  orderHistory,
  deleteOrderHistory,
} from "../controllers/customer.js";
import checkLogin from "../controllers/check_login.js";

const customer = Router();

// ---- POST ----
customer.post("/login", validateLoginCustomer, customerLogin);
customer.post(
  "/register",
  [validateRegisterCustomer, checkUserConflict],
  customerRegister
);
customer.post("/order", authUser, customerAddOrder);
customer.post("/logout", customerLogout);
// ---- GET ----
customer.get("/info", authUser, customerInfo);
customer.get("/status", authUser, checkLogin);
customer.get("/order-history", authUser, orderHistory);
// ---- EDIT ----
customer.put("/edit", authUser, customerEditInfo);
// ---- DELETE ----
customer.delete("/delete/order-history", authUser, deleteOrderHistory);
customer.delete("/delete", authUser, customerDeleteAccount);

export default customer;
