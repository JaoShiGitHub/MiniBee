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

// Insert menu -> For admin
const insertMenu = async (req, res) => {
  const { name, price, details, ingredients, image } = req.body;

  let imageBuffer = null;

  if (image) {
    imageBuffer = Buffer.from(image.split(",")[1], "base64");
  }

  try {
    await pool.query(
      `INSERT INTO menu (name, price, details, ingredients, image) VALUES ($1, $2, $3, $4, $5)`,
      [name, price, details, ingredients, imageBuffer]
    );
    return res.status(200).json({ message: "Insert Menu Successfully" });
  } catch (error) {
    return res.json({ message: error.message });
  }
};

export { getMenu, insertMenu };
