/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
	name: {
		type: String
	},
	industry_id: {
		type: String
	},
	size: {
		type: String
	},
	revenue: {
		type: Number
	},
	region: {
		type: String
	},
	country: {
		type: String
	},
	postal_code: {
		type: String
	},
	linkedin_url: {
		type: String
	},
	linkedin_about: {
		type: String
	},
	linkedin_post: {
		type: String
	},
	website_url: {
		type: String
	},
	status: {
		type: Number //1 - Active, 2 - Deactive, 3 - Deleted
	}
}, { timestamps: true });

exports.companySchema = companySchema;
exports.Company = mongoose.model("Company", companySchema);
