import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();
// Routes
import menu from "./routers/menu_routes.js";
import customer from "./routers/customer_routes.js";
import order from "./routers/order_routes.js";
import authUser from "./middlewares/auth.js";

app.use(express.json({ limit: "10mb" })); // allows Express to read and understand JSON data sent in the body of a request.
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/customer", customer);
app.use("/menu", menu);
app.use("/order", order);

app.get("/checkme", authUser, (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      user: req.customer,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(4000, () => {
  console.log("Server is listening at port 4000");
});
