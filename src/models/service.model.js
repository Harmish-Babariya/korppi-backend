/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const serviceSchema = mongoose.Schema({
	title: {
		type: String
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	company: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Client'
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
	features: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Feature'
	}],
	benefits: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Benefit'
	}],
	target_market: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'TargetMarket'
	}
}, { timestamps: true, versionKey: false });

exports.serviceSchema = serviceSchema;
exports.Service = mongoose.model("Service", serviceSchema);
