const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const { Emails } = require("../../../models/emails.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Emails,
});

exports.handler = async (req, res) => {
  try {
    let meta = {};
    let emailList = [];
    const pageNumber = parseInt(req.body.pageNumber);
    const pageSize = parseInt(req.body.pageSize);
    const skip = pageNumber === 1 ? 0 : parseInt((pageNumber - 1) * pageSize);
    const matchQuery = { userId: req.user._id };
    let selectArr = ["prospectId", "companyId", "isSent", "sentAt", "isOpen", "counts", "openAt"]
    let populateArr = ["prospectId", "companyId"]
    if (req.body.emailId && req.body.emailId != '') {
      matchQuery['_id'] = new ObjectId(req.body.emailId)
    } 
    // if (req.body.search && typeof req.body.search !== "undefined" && req.body.search !== '') {
    //   matchQuery.$or = [
    //     { name: { $regex: '.*' + req.body.search + '.*', $options: 'i' } }
    //   ];
    // }

    if (req.body.emailId) {
      selectArr = ["subject", "body"]
      populateArr = []
    }
    emailList = await makeMongoDbService.getDocumentByQueryPopulate(
        matchQuery,
        selectArr,
        populateArr,
        pageNumber,
        pageSize,
        { _id: -1 }
      );

  const emailCount = await makeMongoDbService.getCountDocumentByQuery(matchQuery);
  meta = {
    pageNumber,
    pageSize,
    totalCount: emailCount,
    prevPage: parseInt(pageNumber) === 1 ? false : true,
    nextPage: parseInt(emailCount) / parseInt(pageSize) <= parseInt(pageNumber) ? false : true,
    totalPages: Math.ceil(parseInt(emailCount) / parseInt(pageSize)),
  };
    return sendResponse(res,null,200,messages.successResponse(emailList, meta));
  } catch (error) {
    console.log(error)
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  emailId: Joi.string().optional(),
  pageNumber: Joi.number().optional().default(1).description("PageNumber"),
  pageSize: Joi.number().optional().default(20).description("PageNumber"),
//   search: Joi.string().optional().allow('').description('search').example('john')
});
