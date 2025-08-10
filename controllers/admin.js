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

export { getAdmins };
