const { Company } = require("../../../models/company.model");
const Joi = require("joi");
const { sendResponse, messages } = require("../../../helpers/handleResponse")
const makeMongoDbServiceCompany = require("../../../services/db/dbService")({
    model: Company,
});

exports.handler = async (req, res) => {
    let body = req.body;
    let _id = body.id;
    const companyDetails = await makeMongoDbServiceCompany.findOneAndUpdateDocument(
        { _id },
        body,
        { new : true }
    )
    return sendResponse(res, null, 200, messages.successResponse(companyDetails));
}

exports.rules = Joi.object({
    id: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/, 'objectId').description("id"),
    name: Joi.string().optional().description("name"),
    industryId: Joi.string().optional().regex(/^[0-9a-fA-F]{24}$/, 'objectId').description("industry"),
    size: Joi.number().optional().description("size"),
    revenue: Joi.number().optional().description("revenue"),
    region: Joi.string().optional().description("region"),
    country: Joi.string().optional().description("country"),
    postalCode: Joi.string().optional().description("postal code"),
    linkedinUrl: Joi.string().optional().description("linkedin url"),
    linkedinAbout: Joi.string().optional().description("linkedin about"),
    linkedinPost: Joi.string().optional().description("linkedin post"),
    websiteUrl: Joi.string().optional().description("website url"),
    status: Joi.number().optional().description("status")
});