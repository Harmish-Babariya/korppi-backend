const { Company } = require("../../../models/company.model");
const Joi = require("joi");
const { sendResponse, messages } = require("../../../helpers/handleResponse")
const makeMongoDbServiceCompany = require("../../../services/db/dbService")({
    model: Company,
});

exports.handler = async (req, res) => {
    let body = req.body;
    body.status = 1;
    const companyDetails = await makeMongoDbServiceCompany.createDocument(body);
    return sendResponse(res, null, 200, messages.successResponse(companyDetails));
}

exports.rules = Joi.object({
    name: Joi.string().required().description("name"),
    industryId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/, 'objectId').description("industry"),
    size: Joi.number().optional().description("size"),
    revenue: Joi.number().optional().description("revenue"),
    region: Joi.string().required().description("region"),
    country: Joi.string().required().description("country"),
    postalCode: Joi.string().required().description("postal code"),
    linkedinUrl: Joi.string().optional().description("linkedin url"),
    linkedinAbout: Joi.string().optional().description("linkedin about"),
    linkedinPost: Joi.string().optional().description("linkedin post"),
    websiteUrl: Joi.string().optional().description("website url"),
});
