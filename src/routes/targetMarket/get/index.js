const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { TargetMarket } = require("../../../models/targetMarket.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: TargetMarket,
});

exports.handler = async (req, res) => {
  try {
    let meta = {};
    let targetMarketList = [];
    const pageNumber = parseInt(req.body.pageNumber);
    const pageSize = parseInt(req.body.pageSize);
    const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
    const matchQuery = { };

    if (req.body.serviceId && req.body.serviceId != '') {
      matchQuery.serviceId = new ObjectId(req.body.serviceId);
    }

    if (req.body.search && typeof req.body.search !== "undefined" && req.body.search !== '') {
      matchQuery.$or = [
        { targetName: { $regex: '.*' + req.body.search + '.*', $options: 'i' } }
      ];
    }
    targetMarketList = await makeMongoDbService.getDocumentByCustomAggregation([
      {
          $match: matchQuery
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: pageSize },
  ])
  const targetMarketCount = await makeMongoDbService.getCountDocumentByQuery(matchQuery);
  meta = {
    pageNumber,
    pageSize,
    totalCount: targetMarketCount,
    prevPage: parseInt(pageNumber) === 1 ? false : true,
    nextPage: parseInt(targetMarketCount) / parseInt(pageSize) <= parseInt(pageNumber) ? false : true,
    totalPages: Math.ceil(parseInt(targetMarketCount) / parseInt(pageSize)),
  };
    return sendResponse(res,null,200,messages.successResponse(targetMarketList, meta));
  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  serviceId: Joi.string().optional().description("Service Id"),
  pageNumber: Joi.number().optional().default(1).description("PageNumber"),
  pageSize: Joi.number().optional().default(20).description("PageNumber"),
  search: Joi.string().optional().allow('').description('search').example('john')
});
