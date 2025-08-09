import { pool } from "../utils/db.js";

// Login
const validateLoginCustomer = async (req, res, next) => {
  const { identifier, password } = req.body;
  // identifier = email || username

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
const validateRegisterCustomer = async (req, res, next) => {
  const requiredFields = {
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    tel: req.body.tel,
    email: req.body.email,
    birthday: req.body.birthday,
  };

  if (!requiredFields.username) {
    return res.status(400).json({ message: "Username is required!" });
  } else if (requiredFields.username.length > 20) {
    return res.status(400).json({
      message: "Username must be less than 20 characters.",
    });
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

  next();
};

const checkUserConflict = async (req, res, next) => {
  const username = req.body.username;

  try {
    const response = await pool.query(
      `SELECT * FROM customers WHERE username = $1`,
      [username]
    );

    const user_account = response.rows[0];

    if (user_account) {
      console.log("The username is not available");

      return res.status(409).json({
        success: false,
        message: "The username is not available. Please try another.",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }

  next();
};

export { validateRegisterCustomer, validateLoginCustomer, checkUserConflict };
