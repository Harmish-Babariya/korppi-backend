/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	email: {
		type: String
	},
	password: {
		type: String
	},
	first_name: {
		type: String
	},
	last_name: {
		type: String
	},
	role: {
		type: String
	},
	phone: {
		type: String
	},
	company_id: {
		type: String
	},
	linkedin_url: {
		type: String
	},
	status: {
		type: Number //1 - Active, 2 - Deactive, 3 - Deleted
	}
}, { timestamps: true });

exports.userSchema = userSchema;
exports.User = mongoose.model("User", userSchema);
