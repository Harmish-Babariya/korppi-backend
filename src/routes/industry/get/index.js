const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { Industry } = require("../../../models/industry.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Industry,
});

exports.handler = async (req, res) => {
  try {
    let meta = {};
    let industryList = [];
    const pageNumber = parseInt(req.body.pageNumber);
    const pageSize = parseInt(req.body.pageSize);
    const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
    const matchQuery = { status: req.body.status };

    if(req.body.id && req.body.id !== '') {
      matchQuery['_id'] = new ObjectId(req.body.id)
    }
    
    if (req.body.search && typeof req.body.search !== "undefined" && req.body.search !== '') {
      matchQuery.$or = [
        { name: { $regex: '.*' + req.body.search + '.*', $options: 'i' } }
      ];
    }
    industryList = await makeMongoDbService.getDocumentByCustomAggregation([
      {
          $match: matchQuery
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: pageSize },
  ])
  const industryCount = await makeMongoDbService.getCountDocumentByQuery(matchQuery);
  meta = {
    pageNumber,
    pageSize,
    totalCount: industryCount,
    prevPage: parseInt(pageNumber) === 1 ? false : true,
    nextPage: parseInt(industryCount) / parseInt(pageSize) <= parseInt(pageNumber) ? false : true,
    totalPages: Math.ceil(parseInt(industryCount) / parseInt(pageSize)),
  };
    return sendResponse(res,null,200,messages.successResponse(industryList, meta));
  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  id: Joi.string().optional().description('id').example('id'),
  pageNumber: Joi.number().optional().default(1).description("PageNumber"),
  pageSize: Joi.number().optional().default(20).description("PageNumber"),
  search: Joi.string().optional().allow('').description('search').example('john'),
  status: Joi.number().valid(1, 2).optional().default(1).description('1- active, 2- deactive, 3- deleted')
});
