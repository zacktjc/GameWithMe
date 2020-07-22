const router = require("express").Router();
const passport = require("../lib/passportConfig");

router.get("/partnerlogin", (req, res) => {
    res.render("auth/partnerlogin");
});
router.get("/userlogin", (req, res) => {
    res.render("auth/userlogin");
});
  
router.post(
    "/partnerlogin",
    passport.authenticate("partner", {
        successRedirect: "/",
        failureRedirect: "/auth/partnerlogin",
        failureFlash: "Invalid Email/Password, Please enter correct details",
    })
);

router.post(
    "/userlogin",
    passport.authenticate("user", {
        successRedirect: "/",
        failureRedirect: "/auth/userlogin",
        failureFlash: "Invalid Email/Password, Please enter correct details",
    })
);

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Oh no!!! dont leave me!!!");
    res.redirect("/");
  });

module.exports = router;