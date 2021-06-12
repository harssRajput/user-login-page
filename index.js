const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");

app.set("views", path.join(__dirname, "views"));
app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const users = [];

//routing code start here
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
    try {
            const { username, email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 7);
            users.push({
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

app.get("/", (req, res) => {
  res.render("index.ejs", { username: "anonymous" });
});

app.get("*", (req, res) => {
  res.send("invalid PATH request");
});
//routing code ends here

app.listen(3000, () => {
  console.log("serving on port 3000!!");
});
