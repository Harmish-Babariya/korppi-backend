const { Client} = require("../../../models/client.model");
const Joi = require("joi");
const { sendResponse, messages } = require("../../../helpers/handleResponse")
const makeMongoDbServiceClient = require("../../../services/db/dbService")({
    model: Client,
});

exports.handler = async (req, res) => {
    let body = req.body;
    body.status = 1;
    const companyDetails = await makeMongoDbServiceClient.createDocument(body);
    return sendResponse(res, null, 200, messages.successResponse(companyDetails));
}

exports.rules = Joi.object({
    name: Joi.string().required().description("name"),
    email: Joi.string().required().description("email"),
    industryId: Joi.string().optional().regex(/^[0-9a-fA-F]{24}$/, 'objectId').description("industry"),
    size: Joi.number().optional().default(0).description("size"),
    revenue: Joi.number().optional().default(0).description("revenue"),
    region: Joi.string().optional().default('').description("region"),
    country: Joi.string().optional().default('').description("country"),
    postalCode: Joi.string().optional().default('').description("postal code"),
    linkedinUrl: Joi.string().optional().default('').description("linkedin url"),
    linkedinAbout: Joi.string().optional().default('').description("linkedin about"),
    linkedinPost: Joi.string().optional().default('').description("linkedin post"),
    websiteUrl: Joi.string().required().description("website url"),
    partnerCompanies: Joi.string().optional().default('').description("coma separeted company name"),
});
