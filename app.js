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

app.use(express.json({ limit: "10mb" }));
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

app.listen(4000, () => {
  console.log("Server is listening at port 4000");
});
