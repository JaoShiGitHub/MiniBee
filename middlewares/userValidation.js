import { pool } from "../utils/db.js";

// Login
const validateLoginUser = async (req, res, next) => {
  const { identifier, password, user_type } = req.body;
  // identifier = email || username

  const user = user_type.toLowerCase();

  if (user !== "customer" && user !== "admin") {
    return res
      .status(400)
      .json({ message: "user type must be customer or admin only" });
  }

  if (!identifier) {
    return res
      .status(400)
      .json({ error: "Please type your username or email." });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  next();
};

// Register
const validateRegisterUser = async (req, res, next) => {
  const { allergy, admin_role, user_type } = req.body;

  const requiredFields = {
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    tel: req.body.tel,
    email: req.body.email,
    birthday: req.body.birthday,
  };

  if (user_type !== "customer" && user_type !== "admin") {
    return res
      .status(400)
      .json({ message: "user type must be customer or admin" });
  }

  if (user_type === "admin" && !admin_role) {
    return res.status(400).json({ message: "Admin role is required" });
  }

  for (const [field, value] of Object.entries(requiredFields)) {
    if (!value) {
      return res.status(400).json({
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is required!`,
      });
    }
  }

  if (user_type === "customer" && !allergy) {
    return res.status(400).json({ message: "Allergy is required" });
  }

  if (requiredFields.username.length > 20) {
    return res.status(400).json({
      message: "Username must be less than 20 characters.",
    });
  }

  next();
};

const checkUserConflict = async (req, res, next) => {
  const username = req.body.username;
  const userType = req.body.user_type;
  const TABLE = userType === "customer" ? "customers" : "admins";

  try {
    const response = await pool.query(
      `SELECT * FROM ${TABLE} WHERE username = $1`,
      [username]
    );

    const user_account = response.rows[0];

    if (user_account) {
      return res.status(409).json({
        success: false,
        message: "The username is not available. Please try another.",
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }

  next();
};

export { validateRegisterUser, validateLoginUser, checkUserConflict };
