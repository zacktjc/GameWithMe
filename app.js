const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const passport = require("./lib/passportConfig");
const session = require("express-session");
const flash = require("connect-flash");
const cloudinary = require("cloudinary");
require("dotenv").config();
var bodyParser = require('body-parser');
const { request } = require("http");
/* 
===================
Connect to MongoDB 
*/
mongoose.connect(
    process.env.MONGOLIVE,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    () => {
      console.log("MongoDB connected!");
    }
);

app.use(express.static("public")); //look for static files in public folder
app.use(express.urlencoded({ extended: true })); //collects form data
app.set("view engine", "ejs"); //view engine setup
app.use(expressLayouts); //Express EJS layout to make views into block
app.use(bodyParser.urlencoded({extended: true}));


//must come after above middleware and before routes
//this creates a session which determines how long
//communication will last
app.use(
    session({
      secret: process.env.SECRET,
      saveUninitialized: true,
      resave: false,
      cookie: { maxAge: 360000 },
    })
);
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});


//must be after sessions
//passport initialization
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//set global variable for ejs files
//third param is mostly called next (moveOn)
app.use(function(request, response, next) {
    // before every route, attach the flash messages and current user to res.locals
    response.locals.alerts = request.flash();
    response.locals.currentUser = request.user;
    next();
});

//routes
app.use("/", require("./routes/home.route"));
app.use("/partner", require("./routes/partner.route"));
app.use("/auth", require("./routes/auth.route"));
app.use("/chatroom", require("./routes/chatroom.route"));


app.get("*", (req, res) => {
    res.send("does not exist");
});

let users = [];

io.on("connection", (socket) => {

//save the users that come in and emit to main.js 
  socket.on('set user', (data, next) => {
    
    if(users.indexOf(data) !== -1){
      next(false)

    }else {
      next(true) 

      socket.username = data;

      users.push(data);

      io.emit('users', users);

    }

  })

  socket.on("send message", (msg) => {
    io.emit("chat message", {user : socket.username, message: msg}); //no longer sending string but send object 
  });

});



//connect to port
http.listen(process.env.PORT, () =>
  console.log(`connected to express on ${process.env.PORT}`)
);