/* Functions to manipulate menu — for admins only */
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

const createMenu = async (req, res) => {
  const { name, price, details, ingredients, image } = req.body;

  let imageBuffer = null;

  if (image) {
    try {
      imageBuffer = Buffer.from(image.split(",")[1], "base64");
    } catch {
      return res
        .status(400)
        .json({ success: false, message: "Invalid image format" });
    }
  }

  try {
    await pool.query(
      `INSERT INTO menu (name, price, details, ingredients, image) VALUES ($1, $2, $3, $4, $5)`,
      [name, price, details, ingredients, imageBuffer]
    );
    return res
      .status(201)
      .json({ success: true, message: "Menu created successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const editMenu = async (req, res) => {
  const { menu_id, menu_name, ingredients, details, price, image } = req.body;

  let imageBuffer = null;

  if (image) {
    try {
      imageBuffer = Buffer.from(image.split(",")[1], "base64");
    } catch {
      return res
        .status(400)
        .json({ success: false, message: "Invalid image format" });
    }
  }

  try {
    await pool.query(
      `UPDATE menu SET name = $1, price = $2, image = $3, details = $4, ingredients = $5  WHERE menu_id = $6`,
      [menu_name, price, imageBuffer, details, ingredients, menu_id]
    );
    res
      .status(200)
      .json({ success: true, message: "Menu updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to edit menu" });
  }
};

const deleteMenu = async (req, res) => {
  const menu_id = req.params.menu_id;
  try {
    const result = await pool.query(
      `DELETE FROM menu WHERE menu_id = $1 RETURNING *`,
      [menu_id]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Menu not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Menu deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Unable to delete menu" });
  }
};

export { getMenu, createMenu, deleteMenu, editMenu };
