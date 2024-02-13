/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
	name: {
		type: String
	},
	industryId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Industry'
	},
	size: {
		type: Number
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
	postalCode: {
		type: String
	},
	linkedinUrl: {
		type: String
	},
	linkedinAbout: {
		type: String
	},
	linkedinPost: {
		type: String
	},
	websiteUrl: {
		type: String
	},
	status: {
		type: Number //1 - Active, 2 - Deactive, 3 - Deleted
	},
	partnerCompanies: {
		type: String
	}
}, { timestamps: true });

exports.companySchema = companySchema;
exports.Company = mongoose.model("Company", companySchema);
