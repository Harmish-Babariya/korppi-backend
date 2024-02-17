/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const emails = mongoose.Schema({
	companyId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company'
	},
	prospectId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Prospects'
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	sentBy: {
		type: String
	},
	subject: {
		type: String,
		default: ''
	},
	body: {
		type: String,
		default: ''
	},
	llmUsed: {
		type: String,
		default: ''
	},
	pixelUuid: {
		type: String,
		default: ''
	},
	tokensUsed: {
		type: String,
		default: ''
	},
	isSent: {
		type: Boolean,
		default: false
	},
	sentAt: {
		type: Date,
		default: ''
	},
	isOpen: {
		type: Boolean,
		default: false
	},
	isUnsubscribed: {
		type: Boolean,
		default: false
	},
	ctaClicked: {
		type: Boolean,
		default: false
	},
	identifier: {
		type: Boolean,
		default: false
	},
	isScheduled: {
		type: Boolean,
		default: false
	},
	scheduleId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'ScheduledEmail',
		default: null
	},
	openAt: {
		type: Date,
		default: ''
	},
	counts: {
		type: Number,
		default: 0
	}
}, { timestamps: true });

exports.emails = emails;
exports.Emails = mongoose.model("Emails", emails);
