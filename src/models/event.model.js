/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
	email_id: {
		type: String
	},
	event: {
		type: String
	}
}, { timestamps: true });

exports.eventSchema = eventSchema;
exports.Event = mongoose.model("Event", eventSchema);
