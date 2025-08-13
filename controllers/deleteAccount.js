const deleteAccount = async (req, res) => {
  const user_id = req.user.id;
  const TABLE =
    req.user.role.toLowerCase() === "customer" ? "customers" : "admins";

  try {
    await pool.query(`DELETE FROM ${TABLE} WHERE id = $1`, [user_id]);

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `Failed to delete account: ${error.message}`,
    });
  }
};

export default deleteAccount;
