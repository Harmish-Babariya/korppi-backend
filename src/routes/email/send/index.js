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
    let emailConfig = req.user.emailConfig.filter(ele => ele.isActive == true)
    let host = emailConfig[0].smtpServer
    let fromEmail = emailConfig[0].email
    let pwd = emailConfig[0].password
    let port = emailConfig[0].smtpPort
    let pageSize = parseInt(req.body.emailCount)
    if (!req.body.isScheduled) {
      let prospectsData = await makeMongoDbService.getDocumentByQueryPopulate(
        {
          userId: userId, isSent: false, isScheduled: false
        },
        ["prospectId", 'subject', 'body'],
        ["prospectId"],
        1,
        pageSize
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
        ["prospectId"],
        1,
        pageSize
        );

        let scheduleData = {
          _id: newId,
          scheduledTime: new Date(req.body.scheduledTime).toISOString(),
          emailsGenerated: parseInt(prospectsData.length),
          user: req.user._id,
          targetMarket: req.body.targetMarket,
          service: req.body.service,
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
  scheduledTime: Joi.string().isoDate().optional().when('isScheduled', { is: true, then: Joi.required()}).description("scheduledTime"),
  emailCount: Joi.number().required().description("emailCount"),
  service: Joi.string().optional().when('isScheduled', { is: true, then: Joi.required()}).description("service"),
  targetMarket: Joi.string().optional().when('isScheduled', { is: true, then: Joi.required()}).description("service")
});
