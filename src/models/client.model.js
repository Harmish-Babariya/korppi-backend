/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
	name: {
		type: String
	},
	industryId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Industry',
		default: null
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
	},
	email: {
		type: String
	},
}, { timestamps: true });

exports.clientSchema = clientSchema;
exports.Client = mongoose.model("Client", clientSchema);
