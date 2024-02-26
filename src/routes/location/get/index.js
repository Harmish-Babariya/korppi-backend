const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { Location  } = require("../../../models/location.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Location,
});

exports.handler = async (req, res) => {
  try {
    let meta = {};
    let locationList = [];
    const pageNumber = parseInt(req.body.pageNumber);
    const pageSize = parseInt(req.body.pageSize);
    const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
    const matchQuery = { status: req.body.status };

    if (req.body.search && typeof req.body.search !== "undefined" && req.body.search !== '') {
      matchQuery.$or = [
        { coutry: { $regex: '.*' + req.body.search + '.*', $options: 'i' } }
      ];
    }
    locationList = await makeMongoDbService.getDocumentByCustomAggregation([
      {
          $match: matchQuery
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: pageSize },
  ])
  const locationCount = await makeMongoDbService.getCountDocumentByQuery(matchQuery);
  meta = {
    pageNumber,
    pageSize,
    totalCount: locationCount,
    prevPage: parseInt(pageNumber) === 1 ? false : true,
    nextPage: parseInt(locationCount) / parseInt(pageSize) <= parseInt(pageNumber) ? false : true,
    totalPages: Math.ceil(parseInt(locationCount) / parseInt(pageSize)),
  };
    return sendResponse(res,null,200,messages.successResponse(locationList, meta));
  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  pageNumber: Joi.number().optional().default(1).description("PageNumber"),
  pageSize: Joi.number().optional().default(20).description("PageNumber"),
  search: Joi.string().optional().allow('').description('search').example('john'),
  status: Joi.number().valid(1, 2).optional().default(1).description('1- active, 2- deleted')
});
