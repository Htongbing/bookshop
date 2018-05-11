let mongoose = require("mongoose"),
	OrderSchema = require("../schemas/order.js"),
	Order = mongoose.model("Order", OrderSchema);

module.exports = Order;