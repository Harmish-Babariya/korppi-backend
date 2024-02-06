/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema({
	title: {
		type: String
	},
	user_id: {
		type: String
	},
	company_id: {
		type: String
	},
	price: {
		type: String
	},
	currency: {
		type: String
	},
	under_offer: {
		type: Boolean
	},
	offer: {
		type: String
	},
	features: {
		type: Array
	},
	benefits: {
		type: Array
	},
	target_market_id:{
		type: String
	}
}, { timestamps: true, versionKey: false });

exports.serviceSchema = serviceSchema;
exports.Service = mongoose.model("Service", serviceSchema);
