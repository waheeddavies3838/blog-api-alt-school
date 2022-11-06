const router = require("express").Router();
const {
  NewBlog,
  Blogs,
  GetBlogsByUserId,
  GetBlogsByStatus,
  UpdateBlogStatus,
  DeleteBlogById,
} = require("../controller/Blog");
const { verifyJwt } = require("../middleware");

router.post("", verifyJwt, NewBlog);

router.get("/all", Blogs);

router.get("", verifyJwt, GetBlogsByStatus);

router.put("/update/:id", verifyJwt, UpdateBlogStatus);

router.delete("/delete/:id", verifyJwt, DeleteBlogById);

router.get("/:user_id", verifyJwt, GetBlogsByUserId);

module.exports = router;
