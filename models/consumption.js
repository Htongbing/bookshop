let mongoose = require("mongoose"),
	ConsumptionSchema = require("../schemas/consumption.js"),
	Consumption = mongoose.model("Consumption", ConsumptionSchema);

module.exports = Consumption;