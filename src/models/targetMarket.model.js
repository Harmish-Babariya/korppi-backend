/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const targetMarket = mongoose.Schema({
	serviceId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Service'
	},
	targetName: {
		type: String
	},
	location: {
		type: Array
	},
	employeeCount: {
		type: Array
	},
	industry: {
		type: Array
	},
	jobTitle: {
		type: Array
	}
}, { timestamps: true });

exports.targetMarket = targetMarket;
exports.TargetMarket = mongoose.model("TargetMarket", targetMarket);
