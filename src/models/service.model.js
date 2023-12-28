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
}, { timestamps: true });

exports.serviceSchema = serviceSchema;
exports.Service = mongoose.model("Service", serviceSchema);
