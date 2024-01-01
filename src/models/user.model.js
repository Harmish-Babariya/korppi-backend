/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	email: {
		type: String
	},
	password: {
		type: String
	},
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	role: {
		type: String
	},
	phone: {
		type: String
	},
	companyId: {
		type: String
	},
	linkedinUrl: {
		type: String
	},
	status: {
		type: Number //1 - Active, 2 - Deactive, 3 - Deleted
	},
	isAdmin: {
		type: Boolean,
		default: false
	}
}, { timestamps: true, versionKey: false });

exports.userSchema = userSchema;
exports.User = mongoose.model("User", userSchema);
