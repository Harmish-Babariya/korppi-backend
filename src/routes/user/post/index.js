const { sendResponse, messages } = require("../../../helpers/handleResponse");
const generatePwd = require("../../../helpers/generatePwd");
const Joi = require("joi");
const bcrypt = require('bcrypt');
const { ObjectId } = require("mongodb");
const { User } = require("../../../models/user.model");
const { Company } = require("../../../models/company.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: User,
});
const makeMongoDbServiceCompany = require("../../../services/db/dbService")({
  model: Company,
});

exports.handler = async (req, res) => {
  try {
    let getCompany = await makeMongoDbServiceCompany.getSingleDocumentByQuery(
      { _id: new ObjectId(req.body.company_id), status: 1 }
    )

    if(!getCompany) return sendResponse(res, null, 404,messages.invalidRequest('Unable to locate a company associated with this company_id.'))

    const generatedPassword = generatePwd(8, true, true, true);
    req.body.status = 1
    req.body.password = bcrypt.hashSync(generatedPassword, parseInt(process.env.SALT_ROUND))
    const data = await makeMongoDbService.createDocument(req.body)
    data.password = generatedPassword
    return sendResponse(res, null, 200, messages.successResponse(data));
  } catch (error) {
    console.log(error)
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  email: Joi.string().required().description("email"),
  first_name: Joi.string().required().description("first_name"),
  last_name: Joi.string().required().description("last_name"),
  role: Joi.string().optional().allow('').default('').description("role"),
  phone: Joi.string().required().description("phone"),
  company_id: Joi.string().min(24).max(24).required().description("company_id"),
  linkedin_url: Joi.string().optional().allow('').default('').description("linkedin_url")
});
