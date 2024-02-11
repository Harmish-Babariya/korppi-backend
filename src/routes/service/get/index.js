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
        let companyId = req.user.companyId;
        let services = await makeMongoDbService.getDocumentByQueryPopulate({
            company: companyId,
        }, null, [
            "user",
            {
                path: "company",
                populate: {
                    path: "industryId",
                    model: "Industry"
                }
            },
            "features",
            "benefits",
            'target_market'
        ]);

        return sendResponse(res, null, 200, messages.successResponse(services));
    } catch (error) {
        console.error(error);
        return sendResponse(res, null, 500, messages.failureResponse());
    }
}