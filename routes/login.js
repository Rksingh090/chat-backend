const express = require("express");
const router = express.Router();
const User = require("../models/user_schema");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getAuthUser } = require("../config/authorizer")


router.post("/", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).lean();

    if (!user)
      return res
        .status(400)
        .json({ message: "Email is wrong ", status: "warning" });

    const hash_psw = user.password;

    if (!bcryptjs.compareSync(password, hash_psw))
      return res
        .status(400)
        .json({ message: "Passord is wrong ", status: "warning" });

    // token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "10d",
      }
    );

    // cookies
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
      sameSite: "none",
      secure: true,
    });

    let userdata = user;
    delete userdata.password;
    delete userdata.otp;
    delete userdata.pin;

    res.status(200).json({
      message: "You have logged in successfully",
      status: "success",
      token: token,
      user: userdata,
      // user: res.locals.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, status: "error" });
  }
});

// check user is login or not
router.get("/check", getAuthUser, async (req, res) => {
  try {

    const user = req.user;

    if (!user) {
      return res.status(404).json({
        logged_in: false
      });
    }
    let userdata = user;
    delete userdata.password;
    delete userdata.otp;
    delete userdata.pin;

    res.status(200).json({
      logged_in: true,
      have_pin: user.have_pin,
      user: userdata
    });

  } catch (error) {
    res.json({
      message: error.message,
      status: "error",
      logged_in: false
    });
  }
});


function validateLogin(req, res, next) {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Please provide email",
      status: "warning",
    });
  }
  if (!password) {
    return res.status(400).json({
      message: "Please provide password",
      status: "warning",
    });
  }

  next();

}


module.exports = router;
