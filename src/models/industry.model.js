/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const industrySchema = mongoose.Schema({
	name: {
		type: String
	}
}, { timestamps: true });

exports.industrySchema = industrySchema;
exports.Industry = mongoose.model("Industry", industrySchema);
