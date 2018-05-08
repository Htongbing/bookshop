let mongoose = require("mongoose");
let bcrypt = require("bcryptjs");
let SALT_WORK_FACTOR = 10;

let ConsumptionSchema = new mongoose.Schema({
	username: {
		unique: true,
		type: String
	},
	money: {
		type: Number,
		default: 100
	},
	password: String,
	detail: Array,
	shoppingCart: Array
});

ConsumptionSchema.statics = {
	findByName: function(username, cb){
		return this
			.findOne({"username": username})
			.exec(cb);
	}
};

module.exports = ConsumptionSchema;