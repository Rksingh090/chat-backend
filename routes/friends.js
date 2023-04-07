const router = require('express').Router();
const User = require('../models/user_schema');
const { getAuthUser } = require('../config/authorizer');

router.get('/',getAuthUser, async (req, res) => {
    try {
        const allfriends = await User.find({ _id: req.user._id }).populate('friends.friend');
        return res.status(200).json(allfriends);
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
});


module.exports = router;
