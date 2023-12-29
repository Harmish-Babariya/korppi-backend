const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { Industry } = require("../../../models/industry.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Industry,
});

exports.handler = async (req, res) => {
  try {
    req.body.status = 1
    const data = await makeMongoDbService.createDocument(req.body)
    return sendResponse(res, null, 200, messages.successResponse(data));
  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  name: Joi.string().required().description("name")
});
