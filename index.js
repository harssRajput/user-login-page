if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config()
}

const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');


const intializePassport = require('./passport-config');
intializePassport(passport,
  email => users.find( user => user.email === email),
  id => users.find( user => user.id === id)
);

app.set("views", path.join(__dirname, "views"));
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session())
app.use(methodOverride('_method'));

const users = [{
  id: '1623592329331',
  username: 'w',
  email: 'w@w',
  password: '$2b$07$tmefwO4BacnWliDDOTg.Yu3INDnc0w5UR1GIWJJEbo1ZWJZ838OZ6'
}];

//routing code start here
app.get("/login", isLoggedIn, (req, res) => {
  res.render("login.ejs");
});

app.post('/login', isLoggedIn, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get("/register", isLoggedIn, (req, res) => {
  res.render("register.ejs");
});

app.post("/register", isLoggedIn, async (req, res) => {
    try {
            const { username, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 7);
            users.push({
                id: Date.now().toString(),
                username,
                email,
                password: hashedPassword,
            });
            res.redirect("/login");
    } catch {
            res.redirect("/register");
        }
    console.log("users fake database-> ", users);
});

app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
})

app.get("/", (req, res) => {
  const{user={}} = req;
  const {username='Anonymous'} = user;
  let isLoggedIn = (username === 'Anonymous'? false: true)
  res.render("index.ejs", {username, isLoggedIn: isLoggedIn});
});

app.get("*", (req, res) => {
  res.send("invalid PATH request");
});
//routing code ends here
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return res.redirect('/');
  }
  next();
}

app.listen(3000, () => {
  console.log("serving on port 3000!!");
});
