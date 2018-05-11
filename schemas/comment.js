let mongoose = require("mongoose");

let CommentSchema = new mongoose.Schema({
	username: String,
	bookId: String,
	content: String,
	time: {
		type: Date,
		default: Date.now()
	}
});

CommentSchema.pre("save", function(next){
	this.time = Date.now();
	next();
});

CommentSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort("time")
			.exec(cb);
	}
};

module.exports = CommentSchema;