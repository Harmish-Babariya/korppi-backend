const { sendResponse, messages } = require("../../../helpers/handleResponse");
const { ObjectId } = require("mongodb");
const Joi = require("joi");
const { Prospects } = require("../../../models/prospects.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Prospects,
});
const { Industry } = require("../../../models/industry.model");
const makeMongoDbServiceIndustry = require("../../../services/db/dbService")({
  model: Industry,
});
const { Company } = require("../../../models/company.model");
const makeMongoDbServiceCompany = require("../../../services/db/dbService")({
  model: Company,
});

exports.handler = async (req, res) => {
  try {
    let industryId = await makeMongoDbServiceIndustry.getSingleDocumentByQuery(
      { name: { $regex: '.*' + req.body.industry + '.*', $options: 'i' } },
      ['_id']
    )
    
    let companies = await makeMongoDbServiceCompany.getDocumentByQuery(
    { $or: [
      { size: { $gt: req.body.employeeCount }},
      { coutry: { $regex: '.*' + req.body.location + '.*', $options: 'i' } },
      { industryId }
    ]},
      ['_id']
    )

    companies = companies.map(ele => ele._id)
    let meta = {};
    let prospectsList = [];
    const pageNumber = parseInt(req.body.pageNumber);
    const pageSize = parseInt(req.body.pageSize);
    const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
    const matchQuery = { 
      company : { $in: companies },
      role: { $regex: req.body.role, $options: 'i' }
  };
    if (req.body.search && typeof req.body.search !== "undefined" && req.body.search !== '') {
      matchQuery.$or = [
        { firstName: { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
        { lastName: { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
        { email: { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
        { role: { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
        { company: { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
        { phone: { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
      ];
    }
    prospectsList = await makeMongoDbService.getDocumentByCustomAggregation([
      {
          $match: matchQuery
      },
      { $sort: { _id: -1 } },
      { $skip: skip },
      { $limit: pageSize },
  ])
  const prospectsCount = await makeMongoDbService.getCountDocumentByQuery(matchQuery);
  meta = {
    pageNumber,
    pageSize,
    totalCount: prospectsCount,
    prevPage: parseInt(pageNumber) === 1 ? false : true,
    nextPage: parseInt(prospectsCount) / parseInt(pageSize) <= parseInt(pageNumber) ? false : true,
    totalPages: Math.ceil(parseInt(prospectsCount) / parseInt(pageSize)),
  };
    return sendResponse(res,null,200,messages.successResponse(prospectsList, meta));
  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  pageNumber: Joi.number().optional().default(1).description("PageNumber"),
  pageSize: Joi.number().optional().default(20).description("PageNumber"),
  search: Joi.string().optional().description("search"),
  employeeCount: Joi.string().required().description('employeeCount').example('employeeCount'),
  location: Joi.string().required().description('location').example('location'),
  industry: Joi.string().required().description('industry').example('industry'),
  role: Joi.string().required().description('role').example('CEO'),
});
