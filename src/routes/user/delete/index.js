const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { User } = require("../../../models/user.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: User,
});

exports.handler = async (req, res) => {
  try {
    let getUser = await makeMongoDbService.getSingleDocumentByQuery(
      { _id: new ObjectId(req.body.id), status: 1 }
    )

    if(!getUser) return sendResponse(res, null, 404,messages.invalidRequest('Unable to locate a User associated with this id.'))

    await makeMongoDbService.updateDocument(
        { _id: new ObjectId(req.body.id) },
        { $set: { status: 3 } }
    )
    return sendResponse(res, null, 200,messages.successResponse("User successfully Deleted."))

  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  id: Joi.string().required().description("User id")
});
