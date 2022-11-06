const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

// signup
exports.Signup = async (req, res) => {
  req.check("email", "email cannot be empty").notEmpty();
  req
    .check("email", "make sure your email is correct and in the right format")
    .isEmail();
  req.check("username", "username cannot be empty").notEmpty();
  req
    .check("password", "password must contain more than 8 characters")
    .isLength({
      min: 8,
      max: 20,
    });

  // check for first error and return error message
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.json({
      status: false,
      message: firstError,
    });
  }

  const { email, username, password, first_name, last_name } = req.body;

  try {
    // check if email exists
    let newemail = await User.findOne({ email });
    if (newemail) {
      return res.json({
        status: 403,
        message: "email exists already",
      });
    }

    // check if username exists
    let newusername = await User.findOne({ username });
    if (newusername) {
      return res.json({
        status: 403,
        message: "user exists already, try another username",
      });
    }

    //check if password contains more than 8 characters
    if (password.length < 8) {
      return res.json({
        message: "password must contain more than 8 characters",
      });
    } else {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          res.json(err);
        } else {
          const newuser = new User({
            username,
            email,
            password: hash,
            first_name,
            last_name,
          });
          newuser
            .save()
            .then(() => {
              res.render("signup", newuser);
              //   return res.json({
              //     status: true,
              //     message: "Sign up successful",
              //     newuser,
              //   });
            })
            .catch((err) => {
              res.json({
                status: false,
                message: `cannot sign user up ${err}`,
              });
            });
        }
      });
    }
  } catch (err) {
    res.json({
      status: false,
      message: `error ${err}`,
    });
  }
};

// login
exports.Signin = async (req, res) => {
  req.check("email", "email cannot be empty").notEmpty();

  req
    .check("email", "make sure your email is correct and in the right format")
    .isEmail();

  req
    .check("password", "password must contain more than 8 characters")
    .isLength({
      min: 8,
      max: 20,
    });

  // check for first error and signal error message
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.json({
      status: false,
      message: firstError,
    });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: 403,
        message: "no account for this user",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      // res.send("check login credentials");
      return res.json({
        success: 403,
        message: "check login credentials",
      });
    } else {
      const payload = {
        _id: user._id,
      };

      const token = jwt.sign(payload, process.env.DB_SECRET);

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 3600000),
      });

      res.redirect("/blogs");

      // return res.json({
      //   status: 200,
      //   token,
      // });
    }
  } catch (err) {
    return res.json({
      status: false,
      message: err,
    });
  }
};

//get all users
exports.GetUser = async (req, res) => {
  User.find()
    .then((user) => {
      return res.json({
        user,
      });
    })
    .catch((err) => {
      return res.json({
        status: false,
        message: `last error ${err}`,
      });
    });
};
