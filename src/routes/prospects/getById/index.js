const { Prospects } = require("../../../models/prospects.model");
const Joi = require("joi");
const { sendResponse, messages } = require("../../../helpers/handleResponse")
const makeMongoDbService = require("../../../services/db/dbService")({
    model: Prospects,
});


exports.handler = async (req, res) => {
    const _id = req.body.id;
    const prospectDetail = await makeMongoDbService.getSingleDocumentByIdPopulate(_id, null, ["company"])
    return sendResponse(res, null, 200, messages.successResponse(prospectDetail));
}

exports.rules = Joi.object({
    id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/, 'objectId').description("id"),
})