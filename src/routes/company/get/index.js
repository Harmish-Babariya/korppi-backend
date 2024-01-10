const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { Company } = require("../../../models/company.model");
const makeMongoDbService = require("../../../services/db/dbService")({
    model: Company,
});

exports.handler = async (req, res) => {
    let meta = {};
    let resultList = [];
    const pageNumber = parseInt(req.body.pageNumber);
    const pageSize = parseInt(req.body.pageSize);
    const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
    const matchQuery = { status: req.body.status };
    if (req.body.search && typeof req.body.search !== "undefined" && req.body.search !== '') {
        matchQuery.$or = [
            { name: { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
            { country: { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
            { region: { $regex: '.*' + req.body.search + '.*', $options: 'i' } },
        ];
    }
    resultList = await makeMongoDbService.getDocumentByCustomAggregation([
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
    return sendResponse(res, null, 200, messages.successResponse(resultList, meta));
};

exports.rules = Joi.object({
    pageNumber: Joi.number().optional().default(1).description("PageNumber"),
    pageSize: Joi.number().optional().default(20).description("PageNumber"),
    search: Joi.string().optional().allow('').description('search').example('john'),
    status: Joi.number().valid(1, 2).optional().default(1).description('1- active, 2- deactive')
});
