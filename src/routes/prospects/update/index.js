const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { Prospects } = require("../../../models/prospects.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Prospects,
});

exports.handler = async (req, res) => {
  try {
    let getData = await makeMongoDbService.getSingleDocumentByQuery(
      { _id: new ObjectId(req.body.id)}
    )

    if(!getData) return sendResponse(res, null, 404,messages.recordNotFound())
    let newData = {
      email: req.body.email ? req.body.email : undefined,
      firstName: req.body.firstName ? req.body.firstName : undefined,
      lastName: req.body.lastName ? req.body.lastName : undefined,
      role: req.body.role ? req.body.role : undefined,
      linkedinUrl: req.body.linkedinUrl ? req.body.linkedinUrl : undefined,
      phone: req.body.phone ? req.body.phone : undefined,
      company: req.body.company ? req.body.company : undefined
    }

    newData = JSON.parse(JSON.stringify(newData))
    const updatedData = await makeMongoDbService.findOneAndUpdateDocument(
      { _id: req.body.id},
      newData,
      { new: true }
    )
    return sendResponse(res, null, 200,messages.successResponse(updatedData))

  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  id: Joi.string().required().description("Prospect id"),
  firstName: Joi.string().optional().description("firstName"),
  lastName: Joi.string().optional().description("lastName"),
  role: Joi.string().optional().description("role"),
  email: Joi.string().optional().description("email"),
  phone: Joi.string().optional().description("phone"),
  linkedinUrl: Joi.string().optional().description("linkedinUrl"),
  company: Joi.string().optional().description("company")
});
