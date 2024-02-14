const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { Prospects } = require("../../../models/prospects.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Prospects,
});

exports.handler = async (req, res) => {
  try {
    const data = await makeMongoDbService.createDocument(req.body)
    return sendResponse(res, null, 200, messages.successResponse(data));
  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  firstName: Joi.string().required().description("firstName"),
  lastName: Joi.string().required().description("lastName"),
  role: Joi.string().required().description("role"),
  email: Joi.string().required().description("email"),
  phone: Joi.string().required().description("phone"),
  linkedinUrl: Joi.string().optional().default('').description("linkedinUrl"),
  company: Joi.string().required().description("company")
});
