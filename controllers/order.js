import { pool } from "../utils/db.js";

const orderHistory = async (req, res) => {
  const customer_id = req.customer.id;

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

const deleteOrderHistory = async (req, res) => {
  const order_id = req.query.order_id;

  if (!order_id) {
    return res.status(400).json({ message: "Missing order_id in query" });
  }

  try {
    await pool.query("DELETE FROM customer_orders WHERE order_id = $1", [
      order_id,
    ]);

    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.jason({ message: error.message });
  }
};

export { orderHistory, deleteOrderHistory };
