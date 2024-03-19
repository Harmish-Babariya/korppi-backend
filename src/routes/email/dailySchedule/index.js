const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const cron = require("node-cron");
const { ObjectId } = require("mongodb");
const { Emails } = require("../../../models/emails.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Emails,
});
const { ScheduledEmail } = require("../../../models/scheduledEmail.model");
const { sendMail } = require("../../../services/mail/send");
const makeMongoDbServiceScheduledEmail =
  require("../../../services/db/dbService")({
    model: ScheduledEmail,
  });

exports.handler = async (req, res) => {
  try {
    const userId = req.user._id;
    const { daysOfWeek, time, endDate, timezone } = req.body;
    let newId = new ObjectId();
    await makeMongoDbService.bulkUpdate(
      { userId: userId, isSent: false },
      { isScheduled: true, scheduleId: newId }
    );

    let prospectsData = await makeMongoDbService.getDocumentByQueryPopulate(
      {
        userId: userId,
        isSent: false,
        isScheduled: true,
      },
      ["prospectId", "subject", "body"],
      ["prospectId"]
    );

    let scheduleData = {
      _id: newId,
      scheduledTime: time,
      emailsGenerated: parseInt(prospectsData.length),
      user: userId,
      targetMarket: null,
      service: null,
      isDailySchedule: true,
      endTime: endDate,
      isActive: true,
      daysOfWeek,
      timezone
    };

    await makeMongoDbServiceScheduledEmail.createDocument(scheduleData);

    // const [hour, minutes] = time.split(":").map(Number);

    // const cronDaysOfWeek = [];
    // for (const dayOfWeek in daysOfWeek) {
    //   if (daysOfWeek[dayOfWeek]) {
    //     cronDaysOfWeek.push(dayOfWeek);
    //   }
    // }

    // const cronSchedule = `${minutes} ${hour} * * ${cronDaysOfWeek.join(",")}`;
    // const jobId = `job_${Date.now()}`;

    // let job = cron.schedule(
    //   cronSchedule,
    //   async () => {
    //     try {
    //       // const scheduledEmails =
    //       //   await makeMongoDbServiceScheduledEmail.getDocumentByQuery(
    //       //     {
    //       //       scheduledTime: time,
    //       //       isActive: true,
    //       //       user: userId,
    //       //     },
    //       //     ["_id"]
    //       //   );
    //       // scheduledEmails.forEach(async (email) => {
    //       let prospectsData =
    //         await makeMongoDbService.getDocumentByQueryPopulate(
    //           {
    //             isSent: false,
    //             isScheduled: true,
    //             scheduleId: newId,
    //           },
    //           ["prospectId", "subject", "body", "userId"],
    //           ["prospectId", "userId"]
    //         );
    //       if (prospectsData) {
    //         prospectsData.map((email) => {
    //           let subject = email.subject;
    //           let body = email.body;
    //           let host = email.userId.emailConfig.smtpServer;
    //           let fromEmail = email.userId.emailConfig.email;
    //           let pwd = email.userId.emailConfig.password;
    //           let port = email.userId.emailConfig.smtpPort;
    //           let userId = email.userId._id;
    //           let toEmail = email.prospectId.email;
    //           sendMail(
    //             host,
    //             fromEmail,
    //             pwd,
    //             toEmail,
    //             port,
    //             userId,
    //             subject,
    //             body
    //           );
    //         });
    //       }

    //       // });
    //     } catch (error) {
    //       console.error("Error executing scheduled task:", error);
    //     }
    //   },
    //   { scheduled: true, timezone: req.body.timezone, name: jobId }
    // );

    // await makeMongoDbServiceScheduledEmail.updateDocument(newId, {
    //   jobId: jobId, isActive: true
    // });
    return sendResponse(res, null, 200, messages.successResponse());
  } catch (error) {
    console.error("Error in handler:", error);
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.stopHandler = async (req, res) => {
  const { jobId } = req.body;

  let job = cron.getTasks().get(jobId);
  if (job) job.stop();
  else return sendResponse(res, null, 404, messages.recordNotFound(jobId));
  cron.getTasks().delete(jobId);
  
  await makeMongoDbServiceScheduledEmail.findOneAndUpdateDocument(
    { jobId: jobId },
    { $set: { isActive: false } }
    );
  return sendResponse(res, null, 200, messages.successResponse(jobId));
};

exports.rule = Joi.object({
  daysOfWeek: Joi.object()
    .pattern(Joi.number().min(0).max(6), Joi.boolean())
    .required()
    .description("days of week (0-6)"),
  time: Joi.string().required().description("time in cron format HH:mm"),
  endDate: Joi.date().iso().description("end date"),
  timezone: Joi.string().required().description("end date"),
  service: Joi.string().required(),
  targetMarket: Joi.string().required()
});

exports.stopRule = Joi.object({
  jobId: Joi.string().required(),
});
