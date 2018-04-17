let mongoose = require("mongoose"),
	UserSchema = require("../schemas/user.js"),
	User = mongoose.model("User", UserSchema);

module.exports = User;