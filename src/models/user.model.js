/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	email: {
		type: String
	},
	password: {
		type: String
	}
}, { timestamps: true });

exports.userSchema = userSchema;
exports.User = mongoose.model("User", userSchema);
