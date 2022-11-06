const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const BlogsSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: String, enum: ["education", "sport"] },
  author: { type: Schema.Types.ObjectId },
  state: { type: String },
  is_read: { type: Boolean },
  read_count: { type: Number },
  reading_time: { type: String },
  body: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
});

module.exports = Mongoose.model("Blog", BlogsSchema);
