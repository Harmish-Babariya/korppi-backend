const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { sendMail } = require("../../../services/mail/send");
const { Emails } = require("../../../models/emails.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Emails,
});

exports.handler = async (req, res) => {
  try {
    let userId = req.user._id;
    let host = req.user.emailConfig.smtpServer
    let fromEmail = req.user.emailConfig.email
    let pwd = req.user.emailConfig.password
    let port = req.user.emailConfig.smtpPort
    let prospectsData = await makeMongoDbService.getDocumentByQueryPopulate(
      {
        userId: userId,
      },
      ["prospectId", 'subject', 'body'],
      ["prospectId"]
    );
    let subject = prospectsData[0].subject
    let body = prospectsData[0].body
    let prospectsEmails = prospectsData.map(ele => ele.prospectId.email)
    sendMail(host, fromEmail, pwd, prospectsEmails, port, userId, subject, body)
    return sendResponse(res, null, 200, messages.successResponse());
  } catch (error) {
    console.log(error);
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  isScheduled: Joi.boolean().required().description("isScheduled")
});
