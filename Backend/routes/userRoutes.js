const express = require("express");
const router = express.Router();
const {
  validateSignup,
  validateLogin,
} = require("../middlewares/validateUser");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  signup,
  login,
  logout,
  checkSession,
} = require("../controllers/userController");

router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/logout", authMiddleware, logout);
router.get("/session", checkSession);

module.exports = router;
