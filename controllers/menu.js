import { pool } from "../utils/db.js";

const getMenu = async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM menu");

    if (data.rows.length === 0) {
      return res.status(404).json({ message: "Menu not found" });
    }

    return res.status(200).json({
      message: "Menu fetched successfully",
      data: data.rows,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { getMenu };
