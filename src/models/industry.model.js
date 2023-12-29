/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const industrySchema = mongoose.Schema({
	name: {
		type: String
	},
	status: {
		type: Number //1- active, 2-Deleted
	}
}, { timestamps: true });

exports.industrySchema = industrySchema;
exports.Industry = mongoose.model("Industry", industrySchema);
