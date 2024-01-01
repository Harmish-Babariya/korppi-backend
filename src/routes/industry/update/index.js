const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { Industry } = require("../../../models/industry.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Industry,
});

exports.handler = async (req, res) => {
  try {
    let getIndustry = await makeMongoDbService.getSingleDocumentByQuery(
      { _id: new ObjectId(req.body.id)}
    )

    if(!getIndustry) return sendResponse(res, null, 404,messages.recordNotFound())
    
    const newData = await makeMongoDbService.findOneAndUpdateDocument(
      { _id: new ObjectId(req.body.id)}, 
      { name: req.body.name },
      { new: true })
    return sendResponse(res, null, 200,messages.successResponse(newData))

  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  id: Joi.string().required().description("Industry id"),
  name: Joi.string().required().description("Industry Name")
});
