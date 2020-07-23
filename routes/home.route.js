const router = require("express").Router();
const Partner = require("../models/partner.model");
const User = require("../models/user.model");
const isLoggedIn = require("../lib/blockCheck");
const { request } = require("express");
const flash = require("connect-flash");
const cloudinary = require("cloudinary");
var multer = require('multer');
var upload = multer({ dest: './uploads/' });
const methodOverride = require('method-override');
const moment = require("moment");
var url = require('url');

router.use(methodOverride('_method'))



router.get("/", async (req, res) => {
    try {
      let partners = await Partner.find({isPartner : true});
      res.render("home/index", { partners });
    } catch(err) {
      console.log(err);
    }
});

router.get("/pending", isLoggedIn, async (req, res) => {
  try {
    let partners = await Partner.find({ isPending : true });
    res.render("home/pending", { partners });
  } catch(err) {
    console.log(err);
  }
});

router.get("/signup", (req, res) => {
    res.render("auth/usersignup");
});

router.get('/flash', function(req, res){
  // Set a flash message by passing the key, followed by the value, to req.flash().
  req.flash('info', 'Username Taken')
  res.render('/signup');
});

router.post("/usersignup", async (req, res) => {
   // console.log(req.body);
    try {
      let { userName, email, password, isPartner, isUser, isAdmin} = req.body;
  
      //hash password dont save password in plain text
      let user = new User({
        userName,
        email,
        password,
        isPartner,
        isUser,
        isAdmin,
      }); 
  
      let savedUser = await user.save();
  
      if (savedUser) {
        req.flash("success", "Welcome to GameWithMe, Please Log In To Continue");
        res.redirect("/");
      }
    } catch (error) {
      if ( error.code == 11000) {
        req.flash("error", "Username used, Please choose a new Username");
        res.redirect("/signup");
      } else {
      console.log(error);
      }
    }
});

router.get("/show/:id", async (req, res) => {
    try {
      //Populate only includes the data from  cuisine collection and ownedBy collection
      let partner = await Partner.findById(req.params.id)

      res.render("partner/show", { partner });
    } catch (error) {
      console.log(error);
    }
});

// router.get("/hire/:id", isLoggedIn, async (req, res) => {
//     Partner.findById(req.params.id).then((partner) => {
//       partner.notification.unshift(req.user.userName + "wants to hire you");
//       console.log(moment().format('llll'));
//       partner.save().then(()=>{
//         res.redirect("/show/"+req.params.id);
//       })
//     });
// });

router.get("/hire/:id", isLoggedIn, async (req, res) => {
  Partner.findById(req.params.id).then((partner) => {
    partner.hiringHistory.unshift(req.user.userName + " Hired " + partner.ign + " " + moment().format('llll'));
    console.log(moment().format('llll'));
    partner.save().then(()=>{
      res.redirect("/show/"+req.params.id);
    })
  });
});

router.get("/testimonial/:id", isLoggedIn, async (req, res) => {
  Partner.findById(req.params.id).then((partner) => {
    var q = url.parse(req.url, true);
    var search = q.query;
    partner.testimonials.unshift(req.user.userName + " testimonial for " + partner.ign + " : " + search.searchBar);
    partner.save().then(()=>{
      res.redirect("/show/"+req.params.id);
    })
  });
});

router.get("/game/:gametitle", async (req, res) => {
  try {
    let partners = await Partner.find({ game : req.params.gametitle });
    res.render("home/index", { partners });
  } catch(err) {
    console.log(err);
  }
});


router.get("/search", async (req, res) => {
  try {
    var q = url.parse(req.url, true);
    var search = q.query;
    console.log(search);
    let partners = await Partner.find({ ign : search.searchBar });
    console.log("partner = " + partners)
    res.render("home/index", { partners });
  } catch(err) {
    console.log(err);
  }
});



//show account
router.get("/account/:id",isLoggedIn, async (req, res) => {
  try {
    let account = "";
    if (req.user.isPartner) {
     account = await Partner.findById(req.params.id);
    } else {
     account = await User.findById(req.params.id);
    }

    res.render("home/account", { account });
  } catch (error) {
    console.log(error);
  }
});

//edit account
router.get("/account/edit/:id",isLoggedIn, (req,res) => {

  if(req.user.isPartner) {
    Partner.findByIdAndUpdate(req.params.id)
    .then((account) => {
        res.render("partner/edit", {account: account});
    })
    .catch((err) => {
        console.log(err);
    })
  }else {
    User.findByIdAndUpdate(req.params.id)
    .then((account) => {
        res.render("home/useredit", {account: account});
    })
    .catch((err) => {
        console.log(err);
    })
  }
})

router.post("/account/edit/:id",isLoggedIn, (req,res) => {
  if(req.user.isPartner) {
    Partner.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
        res.redirect("/account/"+req.params.id);
        console.log("completed");;
    })
    .catch((err) => {
        console.log(err);
    })
  } else {
    User.findByIdAndUpdate(req.params.id, req.body)
    .then(() => {
        res.redirect("/account/"+req.params.id);
        console.log("completed");;
    })
    .catch((err) => {
        console.log(err);
    })
  }
})

//approve partner
router.post("/bePartner/:id",isLoggedIn, (req,res) => {
  console.log(req.params.id);
  Partner.findById(req.params.id, function(err, partner){
    partner.isPartner = !partner.isPartner;
    partner.save(function(err) {
      if(err) {
        console.log(err);
      }
    });
  });
})


//delete account
router.delete("/delete/:id",isLoggedIn, (req, res) => {
  if(req.user.isPartner) {
    Partner.findByIdAndDelete(req.params.id)
    .then(() => {
        res.redirect("/");
        console.log("completed");;
    })
    .catch((err) => {
        console.log(err);
    })
  } else {
    User.findByIdAndDelete(req.params.id)
    .then(() => {
        res.redirect("/");
        console.log("completed");;
    })
    .catch((err) => {
        console.log(err);
    })
  }
})

router.get("/uploadphoto/:id",isLoggedIn, (req,res) => {
  Partner.findByIdAndUpdate(req.params.id)
  .then((account) => {
      console.log(account);
      res.render("partner/uploadphoto", {account: account});
  })
  .catch((err) => {
      console.log(err);
  })
})
router.post("/uploadphoto/:id", upload.single('upload'), isLoggedIn, async (req, res) => {
// console.log(req.body);
//console.log(req.file.path);
cloudinary.uploader.upload(req.file.path, function (result) {
  console.log(result);
  req.body.img = result.secure_url;
Partner.findByIdAndUpdate(req.params.id, req.body)
.then((partner) => {
  console.log(partner)
  res.redirect("/account/"+req.params.id);
  });
  })
   .catch((err) => {
    console.log(err);
})
});


module.exports = router;