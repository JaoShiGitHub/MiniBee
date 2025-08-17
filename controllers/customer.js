import { pool } from "../utils/db.js";
// Only unexpected errors reach here — return generic 500

const getCustomers = async (req, res) => {
  try {
    const data = await pool.query(`SELECT * FROM customers`);
    const customers = data.rows;

    if (customers.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No customers found" });
    }

    return res.status(200).json({ success: true, customers });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get customers" });
  }
};

// Add New Order
const customerAddOrder = async (req, res) => {
  const { note, diningStatus, order } = req.body;
  const customer_id = req.user.id;
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
  const total_price = order.reduce(
    (total, item) => total + item.price * item.count,
    0
  );

  try {
    const response = await pool.query(
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
    console.log("test customer_orders: ", response);

    const orderQueries = order.map((item) => {
      return pool.query(
        `INSERT INTO order_items (order_id, product_id ,product_name, product_price, amount) VALUES ($1, $2, $3, $4, $5)`,
        [order_id, item.menu_id, item.name, item.price, item.count]
      );
    });

    await Promise.all(orderQueries);

    return res
      .status(201)
      .json({ success: true, message: "Order has been created" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to add new order: ${error.message}`,
    });
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
  const customer_id = req.user.id;
  const imageBuffer = image ? Buffer.from(image.split(",")[1], "base64") : null;

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
    return res
      .status(200)
      .json({ success: true, message: "Customer info has been updated" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to edit customer info: ${error.message}`,
    });
  }
};

// Get Customer's Info
const customerInfo = async (req, res) => {
  const customer_id = req.user.id;
  try {
    const info = await pool.query("SELECT * FROM customers WHERE id = $1", [
      customer_id,
    ]);

    const customer = info.rows[0];

    if (!customer) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Customer info fetched successfully",
      customer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to get customer info: ${error.message}`,
    });
  }
};
// ---------------- CUSTOMER ORDER ----------------

const customerOrderHistory = async (req, res) => {
  const customer_id = req.user.id;

  try {
    const data = await pool.query(
      "SELECT * FROM customer_orders WHERE customer_id = $1",
      [customer_id]
    );
    const arrOrderId = data.rows.map((obj) => obj["order_id"]);

    if (arrOrderId.length === 0) {
      return res.status(200).json({
        message: "No orders found",
        orderItems: [],
      });
    }

    const placeholders = arrOrderId
      .map((_, index) => `$${index + 1}`)
      .join(", ");

    const orderItems = await pool.query(
      `SELECT * FROM order_items WHERE order_id IN (${placeholders})`,
      arrOrderId
    );

    // I use this code because I want to group the items that have the same order_id together
    // Otherwise they'll come separately
    const items = orderItems.rows.reduce((acc, item) => {
      acc[item.order_id] = acc[item.order_id] || [];
      acc[item.order_id].push(item);
      return acc;
    }, {});

    const orderDetails = data.rows.map((order) => {
      let newDetails = {};

      Object.entries(items).map(([key, value]) => {
        if (key === order.order_id) {
          newDetails = {
            ...order,
            items: value,
          };
        }
      });

      return newDetails;
    });

    const filteredOrdered = orderDetails.filter(
      (order) => Object.keys(order).length > 0
    );

    return res
      .status(200)
      .json({ message: "Order history fetched successfully", filteredOrdered });
  } catch (error) {
    return res.json({
      message: `Failed to fetch order history: ${error.message}`,
    });
  }
};

const customerDeleteOrderHistory = async (req, res) => {
  const order_id = req.params.order_id;

  if (!order_id) {
    return res.status(400).json({ message: "Missing order_id in query" });
  }

  try {
    await pool.query("DELETE FROM customer_orders WHERE order_id = $1", [
      order_id,
    ]);

    return res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getCustomers,
  customerAddOrder,
  customerEditInfo,
  customerInfo,
  customerOrderHistory,
  customerDeleteOrderHistory,
};
