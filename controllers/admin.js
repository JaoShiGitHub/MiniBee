import { pool } from "../utils/db.js";

const getAdmins = async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM admins");
    const admins = data.rows;

    if (admins.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Admins not found" });
    }

    return res.status(200).json({ success: true, admins });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getAdminById = async (req, res) => {
  const admin_id = req.user.id;
  try {
    const data = await pool.query("SELECT * FROM admins WHERE id = $1", [
      admin_id,
    ]);
    const admin = data.rows[0];

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, admin });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const editInfo = async (req, res) => {
  const admin_id = req.user.id;
  const { username, firstName, lastName, tel, email, admin_role, image } =
    req.body;

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
      `UPDATE admins SET username = $1, firstname = $2, lastname = $3, tel = $4, email = $5, admin_role = $6, image = $7 WHERE id = $8`,
      [
        username,
        firstName,
        lastName,
        tel,
        email,
        admin_role,
        imageBuffer,
        admin_id,
      ]
    );
    return res
      .status(200)
      .json({ success: true, message: "User has been updated" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

export { getAdmins, getAdminById, editInfo };
