const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { Role } = require("../../../models/roles.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Role,
});

exports.handler = async (req, res) => {
  try {
    let meta = {};
    let roleList = [];
    const pageNumber = parseInt(req.body.pageNumber);
    const pageSize = parseInt(req.body.pageSize);
    const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
    const matchQuery = { status: req.body.status };

    if (req.body.search && typeof req.body.search !== "undefined" && req.body.search !== '') {
      matchQuery.$or = [
        { name: { $regex: '.*' + req.body.search + '.*', $options: 'i' } }
      ];
    }
    roleList = await makeMongoDbService.getDocumentByCustomAggregation([
      {
          $match: matchQuery
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: pageSize },
  ])
  const roleCount = await makeMongoDbService.getCountDocumentByQuery(matchQuery);
  meta = {
    pageNumber,
    pageSize,
    totalCount: roleCount,
    prevPage: parseInt(pageNumber) === 1 ? false : true,
    nextPage: parseInt(roleCount) / parseInt(pageSize) <= parseInt(pageNumber) ? false : true,
    totalPages: Math.ceil(parseInt(roleCount) / parseInt(pageSize)),
  };
    return sendResponse(res,null,200,messages.successResponse(roleList, meta));
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
