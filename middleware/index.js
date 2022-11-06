const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.verifyJwt = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.status(400).json({ message: "no token" });
  } else {
    jwt.verify(token, process.env.DB_SECRET, (err, decoded) => {
      if (err) {
        res.json({
          status: 401,
          message: "you do not have authorization access",
        });
      } else {
        req.userId = decoded._id;
        next();
      }
    });
  }
};
