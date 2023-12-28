/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const featureSchema = mongoose.Schema({
	description: {
		type: String
	},
	service_id: {
		type: String
	}
}, { timestamps: true });

exports.featureSchema = featureSchema;
exports.Feature = mongoose.model("Feature", featureSchema);
