const { Schema, default: mongoose } = require("mongoose");
const { Blog, User } = require("../models");

// create new blog
exports.NewBlog = async (req, res) => {
  const { title, description, body, tags, reading_time } = req.body;
  let tag_categories = tags;
  tag_categories = ["Education", "Business", "Sport", "Politics"];
  let count = 0;
  try {
    const newBlog = new Blog({
      title,
      description,
      state: "draft",
      body,
      author: req.userId,
      tags: tag_categories.map((tag) => tag),
      read_count: count,
      is_read: true ? count + 1 : count,
    });

    newBlog.save((err, data, next) => {
      if (err) return next(err);

      return res.json({
        status: 201,
        data,
      });
    });
  } catch (err) {
    return res.json({
      message: `last error ${err}`,
    });
  }
};

// get all blogs
exports.Blogs = async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const count = await Blog.countDocuments();

  const queryOptions = {
    $and: [
      {
        author: {
          $regex: search,
          $options: "i",
        },
      },
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        tags: {
          $regex: search,
          $options: "i",
        },
      },
    ],
  };

  Blog.find({ status: "published", queryOptions })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec()
    .then((data) => {
      return res.json({
        data,
        current_page: Number(page),
        total_count: Math.ceil(count / limit),
      });
    })
    .catch((err) => {
      return res.json({
        status: 403,
        message: err,
      });
    });
};

//get blogs by status
exports.GetBlogsByStatus = (req, res) => {
  const statusFilter = req.query.state ? { state: req.query.state } : {};
  Blog.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $match: {
        author: mongoose.Types.ObjectId(req.userId),
        ...statusFilter,
      },
    },
  ])
    .then((blogs) => {
      return res.json({
        data: blogs.map(({ user, ...blog }) => ({
          ...blog,
          authorName: `${user[0].first_name} ${user[0].last_name}`,
        })),
      });
    })
    .catch((err) => {
      return res.json({
        status: false,
        message: err,
      });
    });
};

//update blog status
exports.UpdateBlogStatus = (req, res) => {
  let count = 0;
  Blog.findByIdAndUpdate(
    { _id: req.params.id },
    {
      state: req.body.state,
      is_read: req.body.is_read,
      read_count: req.body.is_read ? count + 1 : count,
    },
    { new: true }
  )
    .then((updatedblog) => {
      return res.json({
        status: 201,
        data: updatedblog,
      });
    })
    .catch((err) => {
      return res.json({
        status: false,
        message: err,
      });
    });
};

// delete blog by blog id
exports.DeleteBlogById = async (req, res) => {
  Blog.findOneAndDelete({ _id: req.params.id })
    .then(() => {
      return res.json({
        status: 201,
        message: "blog deleted",
      });
    })
    .catch((err) => {
      return res.json({
        status: false,
        message: err,
      });
    });
};

// get blogs by user id
exports.GetBlogsByUserId = (req, res) => {
  User.findOne({
    _id: req.params.user_id,
  })
    .populate({ path: "blogs", options: { sort: { date: -1 } } })
    .then((userblog) => {
      return res.json({
        status: true,
        data: userblog.blogs,
      });
    })
    .catch((err) => {
      return res.json({
        status: false,
        message: err,
      });
    });
};
