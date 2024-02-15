const { Client} = require("../../../models/client.model");
const Joi = require("joi");
const { sendResponse, messages } = require("../../../helpers/handleResponse")
const makeMongoDbServiceCompany = require("../../../services/db/dbService")({
    model: Client,
});


exports.handler = async (req, res) => {
    const _id = req.body.id;
    const companyDetail = await makeMongoDbServiceCompany.getSingleDocumentByIdPopulate(_id,null,["industryId"])
    return sendResponse(res, null, 200, messages.successResponse(companyDetail));
}

exports.rules = Joi.object({
    id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/, 'objectId').description("id"),
})