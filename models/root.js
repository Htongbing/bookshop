let mongoose = require("mongoose"),
	RootSchema = require("../schemas/user.js"),
	Root = mongoose.model("Root", RootSchema);

module.exports = Root;