let mongoose = require("mongoose"),
	CommentSchema = require("../schemas/comment.js"),
	Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;