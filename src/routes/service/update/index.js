const { Service } = require("../../../models/service.model");
const { Benefit } = require("../../../models/benefits.model");
const { Feature } = require("../../../models/feature.model");
const { TargetMarket } = require("../../../models/targetMarket.model");
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
const makeMongoDbServiceTargetMarket = require("../../../services/db/dbService")({
    model: TargetMarket,
});


exports.handler = async (req, res) => {
    try {
        let userId = req.user.id;
        let companyId = req.user.companyId;
        let serviceId = req.body.serviceId;

        let features = req.body.features;
        let benefits = req.body.benefits;
        let service = await makeMongoDbService.findOneAndUpdateDocument(
            { _id: serviceId }, {
            title: req.body.title,
            user: userId,
            company: companyId,
            price: req.body.price,
            currency: req.body.currency,
            under_offer: req.body.under_offer,
            offer: req.body.offer
        });

        await Feature.deleteMany({ service_id: service.id });
        await TargetMarket.deleteMany({ service_id: service.id });
        await Benefit.deleteMany({ service_id: service.id });

        let featurePromises = features.map(description => {
            return makeMongoDbServiceFeature.createDocument({
                description: description,
                service_id: serviceId
            });
        });
        let featureDocuments = await Promise.all(featurePromises);
        let featureIds = featureDocuments.map(feature => feature.id);

        let benefitPromises = benefits.map(description => {
            return makeMongoDbServiceBenefit.createDocument({
                description: description,
                service_id: service.id
            });
        });
        let benefitDocuments = await Promise.all(benefitPromises);
        let benefitIds = benefitDocuments.map(benefit => benefit.id);

        let targetMarket = await makeMongoDbServiceTargetMarket.createDocument({
            service_id: service.id,
            target_name: req.body.target_name,
            location: req.body.location,
            employee_count: req.body.employee_count,
            industry: req.body.industry,
            job_title: req.body.job_title
        });

        let updatedService = await makeMongoDbService.findOneAndUpdateDocument(
            { _id: service.id },
            { features: featureIds, benefits: benefitIds, target_market: targetMarket.id },
            { new: true }
        );

        return sendResponse(res, null, 200, messages.successResponse(updatedService));
    } catch (error) {
        console.error(error);
        return sendResponse(res, null, 500, messages.failureResponse());
    }
}

exports.rules = Joi.object({
    serviceId: Joi.string().required().min(24).max(24).description('serviceId'),
    title: Joi.string().required().description("title"),
    price: Joi.number().required().description("price"),
    currency: Joi.string().required().description("currency"),
    under_offer: Joi.boolean().required().description("under_offer"),
    offer: Joi.string().required().description("offer"),
    features: Joi.array().required().description("features"),
    benefits: Joi.array().required().description("benefits"),
    target_name: Joi.string().required().description("target_name"),
    location: Joi.array().required().description("location"),
    employee_count: Joi.array().required().description("employee_count"),
    industry: Joi.array().required().description("industry"),
    job_title: Joi.string().required().description("job_title"),
});
