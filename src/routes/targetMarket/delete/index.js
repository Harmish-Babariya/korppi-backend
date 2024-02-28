const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { TargetMarket } = require("../../../models/targetMarket.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: TargetMarket,
});
const { Service } = require("../../../models/service.model");
const makeMongoDbServiceService = require("../../../services/db/dbService")({
  model: Service,
});

exports.handler = async (req, res) => {
  try {
    await makeMongoDbService.findOneAndDeleteDocument(new ObjectId(req.body.targetMarketId))
    await makeMongoDbServiceService.updateDocument(new ObjectId(req.body.serviceId), {
      $pull: { target_market: new ObjectId(req.body.targetMarketId) }
    })
    return sendResponse(res, null, 200, messages.successResponse());
  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  serviceId: Joi.string().required().description("Service ID"),
  targetMarketId: Joi.string().required().description("targetMarketId")
});
