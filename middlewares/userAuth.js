import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized. Please login again." });
  }

  try {
    const decoded_token = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded_token) {
      return res.status(401).json({ message: "Invalid Token" });
    }

    req.user = decoded_token;

    next();
  } catch (error) {
    return res.json({
      message: `Failed to verify token: ${error.message}`,
    });
  }
};

const isAdmin = async (req, res, next) => {
  const user = req.user.role;

  if (user !== "admins") {
    return res.status(403).json({ message: "Access forbidden: admins only" });
  }
  next();
};

export { authUser, isAdmin };
