const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require('mongodb');
const { sendMail } = require("../../../services/mail/send");
const { Emails } = require("../../../models/emails.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Emails,
});
const { ScheduledEmail } = require("../../../models/scheduledEmail.model");
const makeMongoDbServiceScheduledEmail = require("../../../services/db/dbService")({
  model: ScheduledEmail,
});

exports.handler = async (req, res) => {
  try {
    let userId = req.user._id;
    let host = req.user.emailConfig.smtpServer
    let fromEmail = req.user.emailConfig.email
    let pwd = req.user.emailConfig.password
    let port = req.user.emailConfig.smtpPort
    if (!req.body.isScheduled) {
      let prospectsData = await makeMongoDbService.getDocumentByQueryPopulate(
        {
          userId: userId, isSent: false, isScheduled: false
        },
        ["prospectId", 'subject', 'body'],
        ["prospectId"]
      );

      if(prospectsData) {
        prospectsData.map(email => {
          let subject = email.subject
          let body = email.body
          let prospectsEmails = email.prospectId.email
          console.log(host, fromEmail, pwd, prospectsEmails, port, userId, subject, body)
          sendMail(host, fromEmail, pwd, prospectsEmails, port, userId, subject, body)
        })
      }
    } else {
      let newId = new ObjectId()
      await makeMongoDbService.bulkUpdate( { userId: userId, isSent: false }, { isScheduled: true, scheduleId: newId } )

      let prospectsData = await makeMongoDbService.getDocumentByQueryPopulate(
        {
          userId: userId, isSent: false, isScheduled: true
        },
        ["prospectId", 'subject', 'body'],
        ["prospectId"]
        );

        let scheduleData = {
          _id: newId,
          scheduledTime: new Date(req.body.scheduledTime).toISOString(),
          emailsGenerated: parseInt(prospectsData.length),
          user: req.user._id,
          targetMarket: null,
          service: null,
          isActive: true,
          isDailySchedule: false
        }
        await makeMongoDbServiceScheduledEmail.createDocument(scheduleData) 
    }
    return sendResponse(res, null, 200, messages.successResponse());
  } catch (error) {
    console.log(error);
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  isScheduled: Joi.boolean().required().description("isScheduled"),
  scheduledTime: Joi.string().isoDate().optional().when('isScheduled', { is: true, then: Joi.required()}).description("scheduledTime")
});
