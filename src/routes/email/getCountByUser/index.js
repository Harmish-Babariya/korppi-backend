const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { Emails } = require("../../../models/emails.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Emails,
});

exports.handler = async (req, res) => {
  try {
    const matchQuery = { userId: req.user._id, isSent: false };
    const emailCount = await makeMongoDbService.getCountDocumentByQuery(
      matchQuery
    );
    return sendResponse(res, null, 200, messages.successResponse({ emailCount }));
  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};
