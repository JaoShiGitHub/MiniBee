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

export { getAdmins, getAdminById };
