const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const JWT_SECRET_KEY = require("../jwtSecret");
const NODE_ENV = process.env.NODE_ENV;

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userCount = await User.countDocuments();

    const newUser = new User({
      email,
      password,
      role: userCount === 0 ? "admin" : "user",
    });
    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created",
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      JWT_SECRET_KEY,
      { expiresIn: "1h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};

const checkSession = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Session expired",
      });
    }

    jwt.verify(token, JWT_SECRET_KEY);

    res.status(200).json({
      success: true,
      message: "Session active",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Session expired",
    });
  }
};

module.exports = { signup, login, logout, checkSession };
