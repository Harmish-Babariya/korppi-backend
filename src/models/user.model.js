/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    role: {
      type: String,
    },
    phone: {
      type: String,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },
    linkedinUrl: {
      type: String,
    },
    status: {
      type: Number, //1 - Active, 2 - Deactive, 3 - Deleted, 4 - warming
    },
    isShowPaywall: {
      type: Boolean,
      default: false
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    emailConfig: [{
      type: {
        email: {
          type: String,
          default: "",
        },
        password: {
          type: String,
          default: "",
        },
        smtpServer: {
          type: String,
          default: "",
        },
        smtpPort: {
          type: String,
          default: "",
        },
        imapServer: {
          type: String,
          default: "",
        },
        imapPort: {
          type: String,
          default: "",
        },
        isActive: {
          type: Boolean,
          default: false
        }
      },
      default: {
        email: "",
        password: "",
        smtpPort: "",
        smtpServer: "",
        imapPort: "",
        imapServer: "",
        isActive: false
      },
      _id: false,
    }]
  },
  { timestamps: true, versionKey: false }
);

exports.userSchema = userSchema;
exports.User = mongoose.model("User", userSchema);
