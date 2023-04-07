const router = require('express').Router();
const { getAuthUser } = require('../config/authorizer');

router.get("/", getAuthUser, async (req, res) => {
    try {
        const {user} = req;

        return res.status(200).json({
            user,
            message: "User profile found",
            status: "success"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            status: "error"
        })
    }
})


module.exports = router;