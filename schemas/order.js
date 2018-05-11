let mongoose = require("mongoose");

let OrderSchema = new mongoose.Schema({
	orderNum: String,
	username: String,
	state: {
		type: String,
		default: "待发货"
	},
	time: {
		type: Date,
		default: Date.now()
	},
	detail: Object,
	expCom: String,
	expNum: Number
});

OrderSchema.pre("save", function(next){
	this.time = Date.now();
	next();
});

OrderSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort("time")
			.exec(cb);
	}
};

module.exports = OrderSchema;