const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const UsersSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String },
  //   blogs: [{ type: Schema.Types.ObjectId, ref: "Blogs" }],
});

module.exports = Mongoose.model("User", UsersSchema);
