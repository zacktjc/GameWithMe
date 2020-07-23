const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

var partnerSchema = new mongoose.Schema({
    userName: {
        type: String,
    },
    ign: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    game: {
        type: String,
        enum: ["dota2", "csgo", "minecraft", "apexLegend"],
    },
    rank: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    isPartner: {
        type: Boolean,
        default: false,
    },
    isUser: {
        type: Boolean,
        default: false,
    },
    isPending: {
        type: Boolean,
        default: true,
    },
    img: {
        type: String,
        default: "https://res.cloudinary.com/dhuiru9bh/image/upload/v1595433119/146-1461473_default-profile-picture-transparent_o06jzv.png",
    },
    hiringHistory: [
        {
            type: String,
        }
    ],
    testimonials: [
        {
            type: String,
        }
    ],
},
    {timestamps:true}
);

partnerSchema.pre("save", function(next) {
  var user = this;
  // Only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  //hash the password
  var hash = bcrypt.hashSync(user.password, 10);

  // Override the cleartext password with the hashed one
  user.password = hash;
  next();
});

partnerSchema.methods.validPassword = function(password) {
  // Compare is a bcrypt method that will return a boolean,
  return bcrypt.compareSync(password, this.password);
};

const Partner = mongoose.model("Partner", partnerSchema);
module.exports = Partner;