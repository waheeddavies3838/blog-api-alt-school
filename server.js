const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const expressValidator = require("express-validator");

const userRoute = require("./route/User");
const blogRoute = require("./route/Blog");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 8080;
// connect to database
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.DB_SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: false,
  })
);
app.use(
  cors({
    origin: [process.env.DB_SECRET, "https://localhost:8080"],
    credentials: true,
  })
);
app.use(expressValidator());
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));
app.engine("ejs", require("ejs").renderFile);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/blogs", blogRoute);

app.use("/signup", (req, res) => {
  res.render("signup.ejs");
});
app.use("/login", (req, res) => {
  res.render("login.ejs");
});

app.use("/new/blog", (req, res) => {
  res.render("create_blog.ejs");
});

app.use("/blogs", (req, res) => {
  res.render("blogs.ejs");
});

app.use("/", (req, res) => {
  res.redirect("/signup");
});

app.listen(PORT, () => {
  console.log("app listening to port 8080");
});

module.exports = app;
