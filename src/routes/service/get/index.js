const { Service } = require("../../../models/service.model");
const { Benefit } = require("../../../models/benefits.model");
const { Feature } = require("../../../models/feature.model");
const Joi = require("joi");
const { sendResponse, messages } = require("../../../helpers/handleResponse")
const makeMongoDbService = require("../../../services/db/dbService")({
    model: Service,
});
const makeMongoDbServiceBenefit = require("../../../services/db/dbService")({
    model: Benefit,
});
const makeMongoDbServiceFeature = require("../../../services/db/dbService")({
    model: Feature,
});


exports.handler = async (req, res) => {
    try {
        let services = await makeMongoDbService.getDocumentByQuery();
    
        return sendResponse(res, null, 200, messages.successResponse(updatedService));
    } catch (error) {
        console.error(error);
        return sendResponse(res, null, 500, messages.failureResponse());
    }
}

exports.rules = Joi.object({
    title: Joi.string().required().description("title"),
    price: Joi.number().required().description("price"),
    currency: Joi.string().required().description("currency"),
    under_offer: Joi.boolean().required().description("under_offer"),
    offer: Joi.string().required().description("offer"),
    features: Joi.array().required().description("features"),
    benefits: Joi.array().required().description("benefits")
});
