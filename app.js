import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();
// Routes
import menuRouter from "./routers/menu_routes.js";
import customerRouter from "./routers/customer_routes.js";
import adminRouter from "./routers/admin_routes.js";
import authRouter from "./routers/auth_routes.js";

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use("/customer", customerRouter);
app.use("/menu", menuRouter);
app.use("/admin", adminRouter);
app.use("/auth", authRouter);

app.listen(4000, () => {
  console.log("Server is listening at port 4000");
});
