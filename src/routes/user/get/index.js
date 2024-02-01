const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { User } = require("../../../models/user.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: User,
});

exports.handler = async (req, res) => {
  try {
    let meta = {};
    let userList = [];
    const pageNumber = parseInt(req.body.pageNumber);
    const pageSize = parseInt(req.body.pageSize);
    const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
    const matchQuery = { status: req.body.status };

    if(req.body.companyId && req.body.companyId !== '') {
      matchQuery.companyId = req.body.companyId
    }
    
    if (req.body.search && typeof req.body.search !== "undefined" && req.body.search !== '') {
      matchQuery.$or = [
        { email: { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
        { firstName: { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
        { lastName: { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
        { role: { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
        { phone: { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
      ];
    }
    userList = await makeMongoDbService.getDocumentByCustomAggregation([
      {
        $match: matchQuery
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: pageSize },
    ])
    const userCount = await makeMongoDbService.getCountDocumentByQuery(matchQuery);
    meta = {
      pageNumber,
      pageSize,
      totalCount: userCount,
      prevPage: parseInt(pageNumber) === 1 ? false : true,
      nextPage: parseInt(userCount) / parseInt(pageSize) <= parseInt(pageNumber) ? false : true,
      totalPages: Math.ceil(parseInt(userCount) / parseInt(pageSize)),
    };
    return sendResponse(res, null, 200, messages.successResponse(userList, meta));
  } catch (error) {

  }
};

exports.rule = Joi.object({
  pageNumber: Joi.number().optional().default(1).description("PageNumber"),
  pageSize: Joi.number().optional().default(20).description("PageNumber"),
  search: Joi.string().optional().allow('').description('search').example('john'),
  status: Joi.number().valid(1, 2).optional().default(1).description('1- active, 2- deactive'),
  companyId: Joi.string().optional().allow('').description('company id for user')
});
