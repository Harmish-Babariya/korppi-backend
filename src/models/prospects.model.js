/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const prospects = mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    role: {
        type: String
    },
	email: {
        type: String
	},
	phone: {
        type: String
	},
	linkedinUrl: {
        type: String
	},
    company: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Company'
	}
}, { timestamps: true });

exports.prospects = prospects;
exports.Prospects = mongoose.model("Prospects", prospects);
