const router = require("express").Router();
const Partner = require("../models/partner.model");
const User = require("../models/user.model");
const isLoggedIn = require("../lib/blockCheck");

router.get("/:id", isLoggedIn, (req, res) => {
    User.findById(req.params.id)
    .then((account) => {
        res.render("chatroom/index", {account: account});
    })
    .catch((err) => {
        console.log(err);
    })
});

module.exports = router;
