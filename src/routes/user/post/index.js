const { sendResponse, messages } = require("../../../helpers/handleResponse");
const generatePwd = require("../../../helpers/generatePwd");
const Joi = require("joi");
const bcrypt = require('bcrypt');
const { ObjectId } = require("mongodb");
const { User } = require("../../../models/user.model");
const { Client} = require("../../../models/client.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: User,
});
const makeMongoDbServiceClient = require("../../../services/db/dbService")({
  model: Client,
});

exports.handler = async (req, res) => {
  try {
    let getCompany = await makeMongoDbServiceClient.getSingleDocumentByQuery(
      { _id: new ObjectId(req.body.companyId), status: 1 }
    )

    if(!getCompany) return sendResponse(res, null, 404,messages.invalidRequest('Unable to locate a client associated with this clientId.'))

    const generatedPassword = generatePwd(8, true, true, true);
    req.body.status = 1
    req.body.password = bcrypt.hashSync(generatedPassword, parseInt(process.env.SALT_ROUND))
    req.body.emailConfig = {
      email: req.body.email || '',
      password: req.body.emailPassword || '',
      smtpPort: req.body.smtpPort || '',
      smtpServer: req.body.smtpServer || ''
   }
    delete req.body.emailPassword
    delete req.body.smtpPort
    delete req.body.smtpServer
    console.log(req.body)
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
  firstName: Joi.string().required().description("first_name"),
  lastName: Joi.string().required().description("last_name"),
  role: Joi.string().optional().allow('').default('').description("role"),
  phone: Joi.string().required().description("phone"),
  companyId: Joi.string().min(24).max(24).required().description("companyId"),
  linkedinUrl: Joi.string().optional().allow('').default('').description("linkedinUrl"),
  emailPassword: Joi.string().optional().allow(''),
  smtpServer: Joi.string().optional().allow(''),
  smtpPort: Joi.string().optional().allow('')
});
