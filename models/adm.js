let mongoose = require("mongoose"),
	AdmSchema = require("../schemas/adm.js"),
	Adm = mongoose.model("Adm", AdmSchema);

module.exports = Adm;