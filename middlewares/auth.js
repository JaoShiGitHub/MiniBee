import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    console.log("Not authorized. Please login again.");

    return res
      .status(401)
      .json({ success: false, message: "Not authorized. Please login again." });
  }

  try {
    const decoded_token = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded_token) {
      console.log("Invalid Token");
      return res.status(401).json({ message: "Invalid Token" });
    }
    req.customer = decoded_token; // manually adds a new property called "customer" to the req object
    console.log("next");

    next();
  } catch (error) {
    return res.json({
      message: `Failed to verify token: ${error.message}`,
    });
  }
};

export default authUser;
