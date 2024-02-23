const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { TargetMarket } = require("../../../models/targetMarket.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: TargetMarket,
});

exports.handler = async (req, res) => {
  try {
    const data = await makeMongoDbService.createDocument(req.body);
    return sendResponse(res, null, 200, messages.successResponse(data));
  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  serviceId: Joi.string().required().description("Service ID"),
  targetName: Joi.string().required().description("Target Name"),
  location: Joi.array().items(Joi.string()).required().description("Location"),
  employeeCount: Joi.array().items(Joi.number()).required().description("Employee Count"),
  industry: Joi.array().items(Joi.string()).required().description("Industry"),
  jobTitle: Joi.string().required().description("Job Title")
});
