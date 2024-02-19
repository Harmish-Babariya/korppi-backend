const nodemailer = require("nodemailer");
const { ObjectId } = require("mongodb");
const { Emails } = require("../../models/emails.model");
const makeMongoDbService = require("../db/dbService")({
  model: Emails,
});

function sendMail(host, fromEmail, pwd, toEmail, port, id, subject, html) {
  const transporter = nodemailer.createTransport({
    host: host,
    port: port || 587,
    secure: false,
    auth: {
      user: fromEmail,
      pass: pwd,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Define email options
  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: subject,
    html: html
  };

  // Send email
  transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
      console.error("Error occurred:", error);
    } else {
      makeMongoDbService.bulkUpdate({ userId: new ObjectId(id)}, {
        isSent: true,
        sentAt: Date.now()
      })
      console.log("Email sent:", info.response, toEmail);
    }
  });
}

module.exports = { sendMail };
