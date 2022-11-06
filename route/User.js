const router = require("express").Router();
const { Signup, Signin, GetUser } = require("../controller/User");
const { verifyJwt } = require("../middleware");

router.post("/signup", Signup);

router.post("/signin", Signin);

router.get("/all", verifyJwt, GetUser);

module.exports = router;
