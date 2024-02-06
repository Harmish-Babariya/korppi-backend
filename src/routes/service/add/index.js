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
        let features = req.body.features;
        let benefits = req.body.benefits;
        let service = await makeMongoDbService.createDocument({
            title: req.body.title,
            price: req.body.price,
            currency: req.body.currency,
            under_offer: req.body.under_offer,
            offer: req.body.offer
        });
        let featureIds;
        features.forEach(async (description, index) => {
            let feature = await makeMongoDbServiceFeature.createDocument({
                description: description,
                service_id: service.id
            });
            featureIds[index] = feature.id;
        });
        let benefitIds;
        benefits.forEach(async (description, index) => {
            let benefit = await makeMongoDbServiceBenefit.createDocument({
                description: description,
                service_id: service.id
            });
            benefitIds[index] = benefit.id;
        });
        service = await makeMongoDbService.findOneAndUpdateDocument(
            { _id: service.id },
            { features: featureIds, benefits: benefitIds },
            { new: true }
        )
        return sendResponse(res, null, 200, messages.successResponse(service));
    } catch (error) {
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
