const express = require("express");
const router = express.Router();
const User = require("../models/user_schema");
const bcryptjs = require("bcryptjs");


// create user
router.post("/", SignupValidation, async (req, res) => {

  // hashing password
  const salt = await bcryptjs.genSalt();
  const hashed_password = await bcryptjs.hash(req.body.password, salt);
 
  const user = new User({
    ...req.body,
    password: hashed_password,
  });

 

  try {
    const newUser = await user.save();
    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: error.message, status: "error" });
  }
}
);


// middleware for register user validation
async function SignupValidation(req, res, next) {
  // check if user exist
  const user = await User.findOne({ email: req.body.email });
  if (user)
    return res
      .status(400)
      .json({ message: "User already exists", status: "error" });

  // check email is valid
  const email = req.body.email;
  const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email_regex.test(email))
    return res
      .status(400)
      .json({ message: "Email is not valid ", status: "error" });


  //Check Phone Number is valid
  if (req.body.phone) {
    const phone = req.body.phone;
    const phone_regex = /^[0-9]{10}$/;
    if (!phone_regex.test(phone))
      return res.status(400).json({
        message: "Phone Number is not valid",
        status: "error",
      });
  }

  // if password length is less than 6 characters
  if (req.body.password.length < 6)
    return res
      .status(400)
      .json({ message: "Password is too short", status: "error" });
    
      
  next();
}

module.exports = router;
