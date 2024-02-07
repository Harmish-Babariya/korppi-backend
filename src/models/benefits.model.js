/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const benefitSchema = mongoose.Schema({
	description: {
		type: String
	},
	service_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Service'
	}
}, { timestamps: true });

exports.benefitSchema = benefitSchema;
exports.Benefit = mongoose.model("Benefit", benefitSchema);
