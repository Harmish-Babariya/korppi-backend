const cron = require("node-cron");
const { ObjectId } = require("mongodb");
const { Emails } = require("../src//models/emails.model");
const makeMongoDbService = require("../src/services/db/dbService")({
  model: Emails,
});
const { ScheduledEmail } = require("../src/models/scheduledEmail.model");
const { sendMail } = require("../src/services/mail/send");
const makeMongoDbServiceScheduledEmail =
  require("../src/services/db/dbService")({
    model: ScheduledEmail,
  });
module.exports = function () {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date().toISOString();
      const scheduledEmails =
        await makeMongoDbServiceScheduledEmail.getDocumentByQuery(
          {
            scheduledTime: { $lte: now },
            isActive: true,
            isDailySchedule: false,
            emailsGenerated: { $ne: 0 },
          },
          ["_id"]
        );
      scheduledEmails.forEach(async (email) => {
        let prospectsData = await makeMongoDbService.getDocumentByQueryPopulate(
          {
            isSent: false,
            isScheduled: true,
            scheduleId: email._id,
          },
          ["prospectId", "subject", "body", "userId"],
          ["prospectId", "userId"]
        );

        console.log(prospectsData);
        if (prospectsData) {
          prospectsData.map((email) => {
            let subject = email.subject;
            let body = email.body;
            let host = email.userId.emailConfig.smtpServer;
            let fromEmail = email.userId.emailConfig.email;
            let pwd = email.userId.emailConfig.password;
            let port = email.userId.emailConfig.smtpPort;
            let userId = email.userId._id;
            let toEmail = email.prospectId.email;
            sendMail(
              host,
              fromEmail,
              pwd,
              toEmail,
              port,
              userId,
              subject,
              body
            );
          });
        }
        await makeMongoDbServiceScheduledEmail.updateDocument(email._id, {
          isActive: false,
        });
      });
    } catch (error) {
      console.error("Error fetching or sending scheduled emails:", error);
    }
  });

  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const hour = now.getUTCHours().toString().padStart(2, "0");
      const minute = now.getUTCMinutes().toString().padStart(2, "0");
      const nowString = `${hour}:${minute}`;
      const dayOfWeek = now.getDay().toString();
      const scheduledEmails =
        await makeMongoDbServiceScheduledEmail.getDocumentByQuery(
          {
            scheduledTime: { $lte: nowString },
            isActive: true,
            isDailySchedule: true,
            emailsGenerated: { $ne: 0 },
            [`daysOfWeek.${dayOfWeek}`]: true,
          },
          ["_id", "endTime"]
        );

      for (const email of scheduledEmails) {
        if (new Date(email.endTime) <= now) {
          await makeMongoDbServiceScheduledEmail.findOneAndUpdateDocument(
            new ObjectId(email._id),
            { $set: { isActive: false } }
          );
        }
      }
    } catch (error) {
      console.error("Error fetching or sending scheduled emails:", error);
    }
  });
};
