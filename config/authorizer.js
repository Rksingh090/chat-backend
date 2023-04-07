const User = require("../models/user_schema");
const jwt = require("jsonwebtoken");


async function getAuthUser(req, res, next) {
    try {
        const token = req.headers["token"] || req.cookies.token;
        // console.log(token)

        if (!token) {
            return res.status(404).json({ message: "No token found" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(404).json({ message: "No token found" });
        }

        const user = await User.findById(decoded.id).select("-password -otp -pin");
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }

        req.user = user;
        next();
    } catch (err) {
        res.json({ message: err.message });
    }
};

module.exports = { getAuthUser };