/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const targetMarket = mongoose.Schema({
	service_id: {
		type: String
	},
	target_name: {
		type: String
	},
	fields: {
		type: String
	}
}, { timestamps: true });

exports.targetMarket = targetMarket;
exports.TargetMarket = mongoose.model("TargetMarket", targetMarket);
