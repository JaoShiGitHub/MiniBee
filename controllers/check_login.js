const checkLogin = (req, res) => {
  try {
    if (!req.customer) {
      return res.status(401).json({
        success: false,
        message: "User is not logged in",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User is still logged in",
      user: req.customer,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default checkLogin;
