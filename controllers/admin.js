import { pool } from "../utils/db.js";

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

export { insertMenu };
