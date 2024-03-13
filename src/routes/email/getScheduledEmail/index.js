const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { ScheduledEmail } = require("../../../models/scheduledEmail.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: ScheduledEmail,
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
        ['isDailySchedule', 'emailsGenerated', 'isActive', 'createdAt', 'scheduledTime', 'endTime'],
        pageNumber,
        pageSize,
        { _id: -1 }
      );

  const emailCount = await makeMongoDbService.getCountDocumentByQuery(matchQuery);
  meta = {
    pageNumber,
    pageSize,
    totalCount: emailCount,
    prevPage: parseInt(pageNumber) === 1 ? false : true,
    nextPage: parseInt(emailCount) / parseInt(pageSize) <= parseInt(pageNumber) ? false : true,
    totalPages: Math.ceil(parseInt(emailCount) / parseInt(pageSize)),
  };
    return sendResponse(res,null,200,messages.successResponse(emailList, meta));
  } catch (error) {
    console.log(error)
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  pageNumber: Joi.number().optional().default(1).description("PageNumber"),
  pageSize: Joi.number().optional().default(20).description("PageNumber"),
});
