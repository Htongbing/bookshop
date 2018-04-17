let mongoose = require("mongoose");
let bcrypt = require("bcryptjs");
let SALT_WORK_FACTOR = 10;

let UserSchema = new mongoose.Schema({
	username: {
		unique: true,
		type: String
	},
	password: String,
	createTime: {
		type: Date,
		default: Date.now()
	},
	sex: String,
	telephone: Number,
	address: String
});

UserSchema.pre("save", function(next){
	let user = this;
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err){
			return next(err);
		};
		bcrypt.hash(user.password, salt, function(err, hash){
			if(err){
				return next(err);
			};
			user.password = hash;
			next();
		});
	});
});

UserSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort("createTime")
			.exec(cb);
	},
	findById: function(id, cb){
		return this
			.findOne({"_id": id})
			.exec(cb);
	}
};

module.exports = UserSchema;