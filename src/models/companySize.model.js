/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const companySizeSchema = mongoose.Schema({
	size: {
		type: String
	},
	status: {
		type: Number, //1- Active, 2-Deleted
        default: 1
	}
}, { timestamps: true });

exports.companySizeSchema = companySizeSchema;
exports.CompanySize = mongoose.model("CompanySize", companySizeSchema);
