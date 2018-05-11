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

ConsumptionSchema.methods = {
	comparePassword: function(password, callback){
		bcrypt.compare(password, this.password, function(err, isMatch){
			if(err){
				callback(err);
				return;
			};
			callback(null, isMatch);
		});
	}
};

ConsumptionSchema.statics = {
	findByName: function(username, cb){
		return this
			.findOne({"username": username})
			.exec(cb);
	},
	updatePassword: function(username, password, cb){
		let _this = this;
		bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
			if(err){
				console.log(err);
				return;
			};
			bcrypt.hash(password, salt, function(err, hash){
				if(err){
					console.log(err);
					return;
				};
				password = hash;
				return _this
					.update({"username": username}, {$set:{"password": password}})
					.exec(cb);
			});
		});
	}
};

module.exports = ConsumptionSchema;