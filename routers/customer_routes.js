import { Router } from "express";
// Middlewares
import authUser from "../middlewares/auth.js";
import {
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
} from "../controllers/customers.js";

const customer = Router();

// POST
customer.post("/login", validateLoginCustomer, customerLogin);
customer.post("/register", validateRegisterCustomer, customerRegister);
customer.post("/order", authUser, customerAddOrder);
customer.post("/logout", customerLogout); // Note: Logout doesn't need authUser
// GET
customer.get("/info", authUser, customerInfo);
// EDIT
customer.put("/edit", authUser, customerEditInfo);
// DELETE
customer.delete("/delete", authUser, customerDeleteAccount);

export default customer;
