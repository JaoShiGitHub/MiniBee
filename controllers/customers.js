import { isEmail } from "../utils/common.js";
import { pool } from "../utils/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Login
const customerLogin = async (req, res) => {
  const { identifier, password } = req.body;

  const type = isEmail(identifier) ? "Email" : "Username";
  try {
    const data = await pool.query(
      `SELECT * FROM customers WHERE ${type.toLowerCase()} = $1`,
      [identifier]
    );

    const customer = data.rows[0];

    if (customer.length === 0) {
      return res.status(404).json({ message: `${type} not found` });
    }

    const isValidPassword = await bcrypt.compare(password, customer.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: `Invalid Password` });
    }

    const token = jwt.sign(
      {
        id: customer.id,
        username: customer.username,
        firstName: customer.firstname,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged in successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Logout
const customerLogout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Register
const customerRegister = async (req, res) => {
  const { username, firstName, lastName, tel, email, birthday, allergy } =
    req.body;
  const customer = { password: req.body.password };

  const salt = await bcrypt.genSalt(10);
  customer.password = await bcrypt.hash(customer.password, salt);

  try {
    await pool.query(
      `INSERT INTO customers (username, password, firstname, lastname, tel, email, allergy, birthday ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        username,
        customer.password,
        firstName,
        lastName,
        tel,
        email,
        allergy,
        birthday,
      ]
    );
    return res.status(201).json({ message: "New customer has been created" });
  } catch (error) {
    return res.json({ message: `Error inserting user: ${error}` });
  }
};

// Add New Order
const customerAddOrder = async (req, res) => {
  const { note, diningStatus, orders } = req.body;
  const customer_id = req.customer.id;
  const payment_status = "Pending";
  const status = "Order Placed";
  const now = new Date();
  const order_date =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0") +
    " " +
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0") +
    ":" +
    String(now.getSeconds()).padStart(2, "0");

  const order_id = Math.random().toString(36).substring(2, 18);
  const total_price = orders.reduce(
    (total, order) => total + order.price * order.count,
    0
  );

  try {
    await pool.query(
      `INSERT INTO customer_orders (order_id, customer_id, status, time, description, dining_status, payment_status, total) VALUES ($1, $2, $3, $4, $5, $6, $7, $8 )`,
      [
        order_id,
        customer_id,
        status,
        order_date,
        note,
        diningStatus,
        payment_status,
        total_price,
      ]
    );

    console.log(
      `New order has been created for ${req.customer.username} with order_id: ${order_id}`
    );

    const orderQueries = orders.map((order) => {
      pool.query(
        `INSERT INTO order_items (order_id, product_id ,product_name, product_price, amount) VALUES ($1, $2, $3, $4, $5)`,
        [order_id, order.menu_id, order.name, order.price, order.count]
      );
    });

    await Promise.all(orderQueries);
    console.log(
      `${req.customer.username}, the order has been created successfully! :)`
    );

    return res.status(200).json({ message: "Order has been created" });
  } catch (error) {
    return res.json({ message: `Failed to add new order: ${error.message}` });
  }
};

// Edit Customer Info
const customerEditInfo = async (req, res) => {
  const {
    username,
    firstName,
    lastName,
    tel,
    email,
    allergy,
    birthday,
    location,
    image,
  } = req.body;
  const customer_id = req.customer.id;
  const imageBuffer = Buffer.from(image.split(",")[1], "base64");
  try {
    await pool.query(
      `UPDATE customers SET username = $1, firstname = $2, lastname = $3, tel= $4, email = $5, allergy = $6, birthday = $7, location = $8, photo = $9 WHERE id = $10`,
      [
        username,
        firstName,
        lastName,
        tel,
        email,
        allergy,
        birthday,
        location,
        imageBuffer,
        customer_id,
      ]
    );
    return res.json({ message: "Customer info has been updated" });
  } catch (error) {
    return res.json({
      message: `Failed to edit customer info: ${error.message}`,
    });
  }
};

// Get Customer's Info
const customerInfo = async (req, res) => {
  const customer_id = req.customer.id;
  try {
    const info = await pool.query("SELECT * FROM customers WHERE id = $1", [
      customer_id,
    ]);

    return res.status(200).json({
      message: "Customer info fetched successfully",
      user_data: info?.rows[0],
    });
  } catch (error) {
    return res.json({
      message: `Failed to get customer info: ${error.message}`,
    });
  }
};

// Delete Customer Account
const customerDeleteAccount = async (req, res) => {
  const customer_id = req.customer.id;

  try {
    await pool.query("DELETE FROM customers WHERE id = $1", [customer_id]);

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to delete account: ${error.message}`,
    });
  }
};

export {
  customerRegister,
  customerAddOrder,
  customerEditInfo,
  customerInfo,
  customerLogin,
  customerLogout,
  customerDeleteAccount,
};
