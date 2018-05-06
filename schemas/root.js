let mongoose = require("mongoose");
let bcrypt = require("bcryptjs");
let SALT_WORK_FACTOR = 10;

let RootSchema = new mongoose.Schema({
	rootname: {
		unique: true,
		type: String
	},
	password: String,
	createTime: {
		type: Date,
		default: Date.now()
	}
});

RootSchema.pre("save", function(next){
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

RootSchema.methods = {
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

RootSchema.statics = {
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

module.exports = RootSchema;