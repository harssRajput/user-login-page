if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userLogin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true
});
const db=mongoose.connection;
db.on('error', console.error.toString.bind(console, 'MongoDB connection error:'));

const intializePassport = require("./passport-config");
intializePassport(
  passport,
  async (email) => await User.findOne({email : email}),
  async (id) => await User.findById({_id: id})
);

const User = require('./models/user');

app.set("views", path.join(__dirname, "views"));
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

//routing code start here
app.get("/login", isLoggedIn, (req, res) => {
  res.render("login.ejs");
});

app.post(
  "/login",
  isLoggedIn,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

app.get("/register", isLoggedIn, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", isLoggedIn, isValid, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 7);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    user.save()
      .then(user => {
        req.flash('info', 'Registered Successfully!!');
        res.redirect("/login");
      })
      .catch(err => {
        req.flash('error', 'Something went wrong :(');
        res.redirect("/register");
      })
  } catch {
    res.redirect("/register");
  }
});

app.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

app.get("/", (req, res) => {
  const { user = {} } = req;
  const { username = "Anonymous" } = user;
  let isLoggedIn = username === "Anonymous" ? false : true;
  res.render("index.ejs", { username, isLoggedIn: isLoggedIn });
});

app.get("*", (req, res) => {
  res.send("404 NOT FOUND!!, invalid PATH request :(");
});
//routing code ends here

//middlewares
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    req.flash('info', 'you already logged in');
    return res.redirect("/");
  }
  next();
}

async function isValid(req, res, next){
  const { username, email } = req.body;
  
  const user = await User.findOne({$or : [{username}, {email}]});
  if(user) {
    req.flash('info', 'username or email already exist');
    return res.redirect('/register');
  }
  next();
}

app.listen(3000, () => {
  console.log("serving on port 3000!!");
});
