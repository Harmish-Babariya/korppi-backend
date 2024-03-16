const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { ScheduledEmail } = require("../../../models/scheduledEmail.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: ScheduledEmail,
});

exports.handler = async (req, res) => {
  try {
    let getData = await makeMongoDbService.getSingleDocumentByQuery(
      { _id: new ObjectId(req.body.id) }
    )

    if(!getData) return sendResponse(res, null, 404,messages.invalidRequest('Unable to locate a data associated with this id.'))
    
    const data = await makeMongoDbService.findOneAndUpdateDocument(
      { _id: req.body.id},
      { isActive: false},
      { new: true }
    )
    return sendResponse(res, null, 200,messages.successResponse(data))

  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  id: Joi.string().required().description("id"),
});
