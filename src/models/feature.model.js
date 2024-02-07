/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const featureSchema = mongoose.Schema({
	description: {
		type: String
	},
	service_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Service'
	}
}, { timestamps: true });

exports.featureSchema = featureSchema;
exports.Feature = mongoose.model("Feature", featureSchema);
