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
      { name: { $in: req.body.industry } },
      ["_id"]
    );
    
    let companies = await makeMongoDbServiceCompany.getDocumentByQuery(
      {
        size: { $in: req.body.employeeCount },
        country: { $in: req.body.location },
        industryId,
      },
      ["_id"]
    );
    
    companies = companies.map((ele) => ele._id);
    console.log(companies)
    let meta = {};
    let prospectsList = [];
    const pageNumber = parseInt(req.body.pageNumber);
    const pageSize = parseInt(req.body.pageSize);
    const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
    const matchQuery = {
      company: { $in: companies },
      role: { $regex: req.body.role, $options: "i" },
    };
    if (
      req.body.search &&
      typeof req.body.search !== "undefined" &&
      req.body.search !== ""
    ) {
      matchQuery.$or = [
        { firstName: { $regex: ".*" + req.body.search + ".*", $options: "i" } },
        { lastName: { $regex: ".*" + req.body.search + ".*", $options: "i" } },
        { email: { $regex: ".*" + req.body.search + ".*", $options: "i" } },
        { role: { $regex: ".*" + req.body.search + ".*", $options: "i" } },
        { company: { $regex: ".*" + req.body.search + ".*", $options: "i" } },
        { phone: { $regex: ".*" + req.body.search + ".*", $options: "i" } },
      ];
    }
    prospectsList = await makeMongoDbService.getDocumentByQueryPopulate(
      matchQuery,
      ["_id", "firstName", "lastName", "company"],
      ["company"],
      pageNumber,
      pageSize,
      { _id: -1 }
    );
    //   prospectsList = await makeMongoDbService.getDocumentByCustomAggregation([
    //     {
    //         $match: matchQuery
    //     },
    //     { $sort: { _id: -1 } },
    //     { $skip: skip },
    //     { $limit: pageSize },
    // ])
    const prospectsCount = await makeMongoDbService.getCountDocumentByQuery(
      matchQuery
    );
    meta = {
      pageNumber,
      pageSize,
      totalCount: prospectsCount,
      prevPage: parseInt(pageNumber) === 1 ? false : true,
      nextPage:
        parseInt(prospectsCount) / parseInt(pageSize) <= parseInt(pageNumber)
          ? false
          : true,
      totalPages: Math.ceil(parseInt(prospectsCount) / parseInt(pageSize)),
    };
    return sendResponse(
      res,
      null,
      200,
      messages.successResponse(prospectsList, meta)
    );
  } catch (error) {
    console.log(error);
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  pageNumber: Joi.number().optional().default(1).description("PageNumber"),
  pageSize: Joi.number().optional().default(20).description("PageNumber"),
  search: Joi.string().optional().description("search"),
  employeeCount: Joi.array().required().description("employeeCount"),
  location: Joi.array().required().description("location"),
  industry: Joi.array().required().description("industry"),
  role: Joi.string().required().description("role").example("CEO"),
});
