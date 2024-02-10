/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const emails = mongoose.Schema({
	company_id: {
		type: String
	},
	user_id: {
		type: String
	},
	subject: {
		type: String
	},
	body: {
		type: String
	},
	llm_used: {
		type: String
	},
	pixel_uuid: {
		type: String
	},
	tokens_used: {
		type: String
	},
	is_sent: {
		type: Boolean
	},
	sent_at: {
		type: Date
	},
	is_open: {
		type: Boolean
	},
	open_at: {
		type: Date
	},
	counts: {
		type: Number
	}
}, { timestamps: true });

exports.emails = emails;
exports.Emails = mongoose.model("Emails", emails);
