const router = require("express").Router();
const isLoggedIn = require("../lib/blockCheck");
const Partner = require("../models/partner.model");


router.get("/signup", (req, res) => {
    res.render("auth/partnersignup");
});

router.post("/signup", async (req, res) => {
   // console.log(req.body);
    try {
      let { userName, ign, email, password, game, rank, description, cost, isPartner, isUser, isPending} = req.body;

      let partner = new Partner({
        userName,
        ign,
        email,
        password,
        game,
        rank,
        description,
        cost,
        isPartner,
        isUser,
        isPending
      }); 
  
      let savedPartner = await partner.save();
  
      if (savedPartner) {
        req.flash("success", "Welcome to GameWithMe, Please Log In To Continue");
        res.redirect("/");
      }
    } catch (error) {
      if ( error.code == 11000) {
        req.flash("error", "Username used, Please choose a new Username");
        res.redirect("/partner/signup");
      } else {
      console.log(error);
      }
    }
});

router.get("/index", (req, res) => {
    res.render("partner/index");
});



module.exports = router;