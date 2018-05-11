let mongoose = require("mongoose");

let OrderSchema = new mongoose.Schema({
	orderNum: String,
	username: {
		unique: true,
		type: String
	},
	state: {
		type: String,
		default: "待发货"
	},
	time: {
		type: Date,
		default: Date.now()
	},
	detail: Object
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