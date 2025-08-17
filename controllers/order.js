import { pool } from "../utils/db.js";

const getOrders = async (req, res) => {
  try {
    const data = await pool.query(`SELECT * FROM customer_orders`);
    const orders = data.rows;

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "History not found" });
    }

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get order history" });
  }
};

const getOrdersByCustomerID = async (req, res) => {
  const { customer_id } = req.params;

  try {
    const data = await pool.query(
      `SELECT * FROM customer_orders WHERE customer_id = $1`,
      [customer_id]
    );

    const orders = data.rows;

    if (orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Orders not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Orders fetched successfully", orders });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to get order history" });
  }
};

export { getOrders, getOrdersByCustomerID };
