const Joi = require("joi");
const { sendResponse, messages } = require("../../../helpers/handleResponse")
const { Prospects } = require("../../../models/prospects.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Prospects,
});


exports.handler = async (req, res) => {
    try {
        const prospects = await makeMongoDbService.hardDeleteDocument(req.body.id)
        return sendResponse(res, null, 200, messages.successResponse(prospects));
    } catch (error) {
        return sendResponse(res, null, 500, messages.failureResponse());
    }

}

exports.rules = Joi.object({
    id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/, 'objectId').description("id"),
})