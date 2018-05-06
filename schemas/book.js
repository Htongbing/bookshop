let mongoose = require("mongoose");

let BookSchema = new mongoose.Schema({
	name: String,
	author: String,
	publish: String,
	pubTime: String,
	price: Number,
	oriPrice: Number,
	img: String,
	summary: String,
	num: Number,
	page: Number,
	word: Number,
	print: String,
	size: String,
	pager: String,
	package: String,
	suit: String,
	ISBN: Number,
	classify: Object,
	sale: {
		type: Number,
		default: 0
	},
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

BookSchema.pre("save", function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	};
	next();
});

BookSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort("meta.updateAt")
			.exec(cb);
	},
	findById: function(id, cb){
		return this
			.findOne({"_id": id})
			.exec(cb);
	}
};

module.exports = BookSchema;