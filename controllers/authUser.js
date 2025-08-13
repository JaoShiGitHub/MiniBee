import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isEmail } from "../utils/common.js";
import { pool } from "../utils/db.js";

// Login
const loginUser = async (req, res) => {
  const { identifier, password, user_type } = req.body;

  const type = isEmail(identifier) ? "Email" : "Username";
  const userType = user_type.toLowerCase();

  try {
    const data = await pool.query(
      `SELECT * FROM ${userType} WHERE ${type.toLowerCase()} = $1`,
      [identifier]
    );

    const user = data.rows[0];

    if (!user) {
      return res.status(404).json({ message: `${type} not found` });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: `Invalid Password` });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        firstName: user.firstname,
        role: user_type,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged in successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Register
const registerUser = async (req, res) => {
  const {
    username,
    firstName,
    lastName,
    tel,
    email,
    birthday,
    allergy,
    admin_role,
  } = req.body;
  const user = { password: req.body.password };
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    if (admin_role) {
      await pool.query(
        `INSERT INTO admins (username, firstname, lastname, tel, email, admin_role, password) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [username, firstName, lastName, tel, email, admin_role, user.password]
      );
    } else {
      await pool.query(
        `INSERT INTO customers (username, password, firstname, lastname, tel, email, allergy, birthday ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          username,
          user.password,
          firstName,
          lastName,
          tel,
          email,
          allergy,
          birthday,
        ]
      );
    }

    return res
      .status(201)
      .json({ success: true, message: "New user has been created" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Error inserting user: ${error.message}`,
    });
  }
};

// Logout
const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { loginUser, logoutUser, registerUser };
