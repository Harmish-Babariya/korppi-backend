const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { Emails } = require("../../../models/emails.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Emails,
});

exports.handler = async (req, res) => {
  try {
    if(req.body.emails) {
        req.body.emails.map(async ele => {
            const emailData = {
                companyId: ele.companyId,
                prospectId: ele.prospectId,
                userId: req.body.userId,
                sentBy: req.body.sentBy
            }
            await makeMongoDbService.createDocument(emailData)
        })
    }
    
    return sendResponse(res, null, 200, messages.successResponse(data));
  } catch (error) {
    console.log(error)
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
    emails: Joi.array().items({
        companyId: Joi.string().required().description("companyId"),
        prospectId: Joi.string().required().description("prospectId"),
    }).required(),
    userId: Joi.string().required().description("userId"),
    sentBy: Joi.string().required().description("sentBy"),
});
