/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const scheduledEmailSchema = mongoose.Schema({
	scheduledTime: {
		type: String
	},
	jobId: {
		type: String,
		default: ''
	},
	emailsGenerated: {
		type: Number 
	},
    user: {
        type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
    },
    targetMarket: {
        type: mongoose.Schema.Types.ObjectId,
		ref: 'TargetMarket'
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
		ref: 'Service'
    },
	isDailySchedule: {
		type: Boolean,
		default: false
	},
	isActive: {
		type: Boolean,
		default: true
	},
	endTime: {
		type: String,
		default: ''
	},
	daysOfWeek: {
		type: Object,
		default: null
	},
	timezone: {
		type: String,
		default: ''
	}
}, { timestamps: true });

exports.scheduledEmailSchema = scheduledEmailSchema;
exports.ScheduledEmail = mongoose.model("ScheduledEmail", scheduledEmailSchema);
