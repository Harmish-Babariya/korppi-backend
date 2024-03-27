const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { Emails } = require("../../../models/emails.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Emails,
});

exports.handler = async (req, res) => {
  try {
    let getData = await makeMongoDbService.getSingleDocumentByQuery(
      { _id: new ObjectId(req.body.id) }
    )

    if(!getData) return sendResponse(res, null, 404,messages.invalidRequest('Unable to locate a data associated with this id.'))

    if(getData.isSent) return sendResponse(res, null, 404,messages.invalidRequest('This email already sent.'))

    let newData = {
        body: req.body.body ? req.body.body : undefined,
        subject: req.body.subject ? req.body.subject : undefined,
    }

    newData = JSON.parse(JSON.stringify(newData))

    const data = await makeMongoDbService.findOneAndUpdateDocument(
      { _id: req.body.id},
      newData,
      { new: true }
    )
    return sendResponse(res, null, 200,messages.successResponse(data))

  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  id: Joi.string().required().description("id"),
  body: Joi.string().optional().description("body"),
  subject: Joi.string().optional().description("subject"),
});
