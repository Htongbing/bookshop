let mongoose = require("mongoose"),
	BookSchema = require("../schemas/book.js"),
	Book = mongoose.model("Book", BookSchema);

module.exports = Book;