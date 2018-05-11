let mongoose = require("mongoose");
let bcrypt = require("bcryptjs");
let SALT_WORK_FACTOR = 10;

let AdmSchema = new mongoose.Schema({
	admname: {
		unique: true,
		type: String
	},
	password: String,
	createTime: {
		type: Date,
		default: Date.now()
	}
});

AdmSchema.pre("save", function(next){
	this.createTime = Date.now();
	let rootuser = this;
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err){
			return next(err);
		};
		bcrypt.hash(rootuser.password, salt, function(err, hash){
			if(err){
				return next(err);
			};
			rootuser.password = hash;
			next();
		});
	});
});

AdmSchema.methods = {
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

AdmSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort("createTime")
			.exec(cb);
	},
	findByName: function(name, cb){
		return this
			.findOne({"rootname": name})
			.exec(cb);
	}
};

module.exports = AdmSchema;