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
        let serviceId = req.body.serviceId;
        let userId = req.user.id;
        let companyId = req.user.companyId;
        let services = await makeMongoDbService.getDocumentByQueryPopulate(
            {
                user: userId,
                company: companyId,
            }, null,
            [
                "user",
                "company",
                "features",
                "benefits"
            ]
        );

        return sendResponse(res, null, 200, messages.successResponse(services));
    } catch (error) {
        console.error(error);
        return sendResponse(res, null, 500, messages.failureResponse());
    }
}

exports.rules = Joi.object({
    serviceId: Joi.string().optional().min(24).max(24).description('serviceId'),
});
