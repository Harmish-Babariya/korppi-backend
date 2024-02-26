/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
	country: {
		type: String
	},
	status: {
		type: Number, //1- Active, 2-Deleted
        default: 1
	}
}, { timestamps: true });

exports.locationSchema = locationSchema;
exports.Location = mongoose.model("Location", locationSchema);
