const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { TargetMarket } = require("../../../models/targetMarket.model"); 
const makeMongoDbService = require("../../../services/db/dbService")({
  model: TargetMarket,
});

exports.handler = async (req, res) => {
  try {
    let getTargetMarket = await makeMongoDbService.getSingleDocumentByQuery(
      { _id: new ObjectId(req.body.id)}
    );

    if(!getTargetMarket) 
      return sendResponse(res, null, 404, messages.recordNotFound());
    
    let updateData = {
      targetName: req.body.targetName ? req.body.targetName : undefined,
      location: req.body.location ? req.body.location : undefined,
      employeeCount: req.body.employeeCount ? req.body.employeeCount : undefined,
      industry: req.body.industry ? req.body.industry : undefined,
      jobTitle: req.body.jobTitle ? req.body.jobTitle : undefined
    }

    updateData = JSON.parse(JSON.stringify(updateData))

    const newData = await makeMongoDbService.findOneAndUpdateDocument(
      { _id: new ObjectId(req.body.id)}, 
      updateData,
      { new: true }
    );

    return sendResponse(res, null, 200, messages.successResponse());
  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  id: Joi.string().required().description("TargetMarket id"),
  targetName: Joi.string().required().description("Target Name"),
  location: Joi.array().items(Joi.string()).required().description("Location"),
  employeeCount: Joi.array().items(Joi.number()).required().description("Employee Count"),
  industry: Joi.array().items(Joi.string()).required().description("Industry"),
  jobTitle: Joi.array().required().description("Job Title")
});
