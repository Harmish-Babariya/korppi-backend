/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const targetMarket = mongoose.Schema({
	service_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Service'
	},
	target_name: {
		type: String
	},
	location: {
		type: Array
	},
	employee_count: {
		type: Array
	},
	industry: {
		type: Array
	},
	job_title: {
		type: String
	}
}, { timestamps: true });

exports.targetMarket = targetMarket;
exports.TargetMarket = mongoose.model("TargetMarket", targetMarket);
