/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const scheduledEmailSchema = mongoose.Schema({
	scheduledTime: {
		type: String
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
    }
}, { timestamps: true });

exports.scheduledEmailSchema = scheduledEmailSchema;
exports.Industry = mongoose.model("ScheduledEmail", scheduledEmailSchema);
