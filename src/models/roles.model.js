/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const roleSchema = mongoose.Schema({
	title: {
		type: String
	},
	status: {
		type: Number, //1- Active, 2-Deleted
        default: 1
	}
}, { timestamps: true });

exports.roleSchema = roleSchema;
exports.Role = mongoose.model("Role", roleSchema);
