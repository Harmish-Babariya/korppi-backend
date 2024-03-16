const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { ScheduledEmail } = require("../../../models/scheduledEmail.model");
const { Service } = require("../../../models/service.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: ScheduledEmail,
});
const makeMongoDbServiceService = require("../../../services/db/dbService")({
  model: Service,
});



exports.handler = async (req, res) => {
  try {
    let meta = {};
    let emailList = [];
    const pageNumber = parseInt(req.body.pageNumber);
    const pageSize = parseInt(req.body.pageSize);
    const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
    const matchQuery = { user: req.user._id };

    emailList = await makeMongoDbService.getDocumentByQuery(
      matchQuery,
      [
        "isDailySchedule",
        "emailsGenerated",
        "isActive",
        "createdAt",
        "scheduledTime",
        "endTime",
        "daysOfWeek",
        "service",
        "createdAt",
      ],
      pageNumber,
      pageSize,
      { _id: -1 }
    );

    let service = emailList[0].service

    let { title } = await makeMongoDbServiceService.getDocumentById(service, ['title'])
    const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

    let data = emailList.map((item) => {
      const { endTime, daysOfWeek, createdAt, isDailySchedule } = item;
      if (isDailySchedule) {
        const endDateTime = new Date(endTime);
        const createdDateTime = new Date(createdAt);
        let totalEmails = 0;

        while (createdDateTime < endDateTime) {
          const dayOfWeek = createdDateTime.getDay().toString();
          if (daysOfWeek[dayOfWeek]) {
            totalEmails++;
          }
          createdDateTime.setDate(createdDateTime.getDate() + 1);
        }

        let label = '';

        for (let i = 0; i < dayLabels.length; i++) {
          if (daysOfWeek[i.toString()]) {
            label += dayLabels[i];
          }
        }
        label += title
        item.totalEmails = totalEmails;
        return { ...item._doc, totalEmails, label };
      }
      return { ...item._doc, totalEmails : 0, label: title };
    });

    const emailCount = await makeMongoDbService.getCountDocumentByQuery(
      matchQuery
    );
    meta = {
      pageNumber,
      pageSize,
      totalCount: emailCount,
      prevPage: parseInt(pageNumber) === 1 ? false : true,
      nextPage:
        parseInt(emailCount) / parseInt(pageSize) <= parseInt(pageNumber)
          ? false
          : true,
      totalPages: Math.ceil(parseInt(emailCount) / parseInt(pageSize)),
    };
    return sendResponse(res, null, 200, messages.successResponse(data, meta));
  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  pageNumber: Joi.number().optional().default(1).description("PageNumber"),
  pageSize: Joi.number().optional().default(20).description("PageNumber"),
});
