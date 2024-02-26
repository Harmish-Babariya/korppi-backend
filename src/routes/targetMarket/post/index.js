const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { TargetMarket } = require("../../../models/targetMarket.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: TargetMarket,
});
const { Service } = require("../../../models/service.model");
const makeMongoDbServiceService = require("../../../services/db/dbService")({
  model: Service,
});

exports.handler = async (req, res) => {
  try {
    const newId = new ObjectId()
    req.body._id = newId
    const data = await makeMongoDbService.createDocument(req.body);
    await makeMongoDbServiceService.updateDocument(req.body.serviceId, {
      $push: { target_market: newId }
    })
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
  jobTitle: Joi.array().required().description("Job Title")
});
