const checkLogin = (req, res) => {
  const user = req.user;
  try {
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not logged in",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User is still logged in",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default checkLogin;
