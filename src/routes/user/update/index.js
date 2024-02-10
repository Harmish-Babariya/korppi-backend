const { sendResponse, messages } = require("../../../helpers/handleResponse");
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
    let getUser = await makeMongoDbService.getSingleDocumentByQuery(
      { _id: new ObjectId(req.body.id), status: 1 }
    )

    if(!getUser) return sendResponse(res, null, 404,messages.invalidRequest('Unable to locate a User associated with this id.'))

    if(req.body.companyId && req.body.companyId !== '') {
      let getCompany = await makeMongoDbServiceCompany.getSingleDocumentByQuery(
        { _id: new ObjectId(req.body.companyId), status: 1 }
      )

      if(!getCompany) return sendResponse(res, null, 404,messages.invalidRequest('Unable to locate a company associated with this companyId.'))
    }
    
    let newData = {
      email: req.body.email ? req.body.email : undefined,
      firstName: req.body.firstName ? req.body.firstName : undefined,
      lastName: req.body.lastName ? req.body.lastName : undefined,
      role: req.body.role ? req.body.role : undefined,
      phone: req.body.phone ? req.body.phone : undefined,
      password: req.body.password ? bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUND)) : undefined,
      companyId: req.body.companyId ? req.body.companyId : undefined,
      linkedinUrl: req.body.linkedinUrl ? req.body.linkedinUrl : undefined,
      status: req.body.status ? req.body.status : undefined,
      emailConfig: Object.keys(req.body.emailConfig).length > 0 ? req.body.emailConfig : undefined
    }

    newData = JSON.parse(JSON.stringify(newData))
    const newUser = await makeMongoDbService.findOneAndUpdateDocument(
      { _id: req.body.id},
      newData,
      { new: true }
    )

    const { password, __v, ...otherData } = newUser._doc
    return sendResponse(res, null, 200,messages.successResponse(otherData))

  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  id: Joi.string().required().description("User id"),
  email: Joi.string().optional().description("email"),
  firstName: Joi.string().optional().description("firstName"),
  lastName: Joi.string().optional().description("lastName"),
  role: Joi.string().optional().description("role"),
  phone: Joi.string().optional().description("phone"),
  password: Joi.string().optional().description("password"),
  companyId: Joi.string().min(24).max(24).optional().description("companyId"),
  linkedinUrl: Joi.string().optional().description("linkedinUrl"),
  status: Joi.number().valid(1,2,3,4).optional().description("status"),
  emailConfig: Joi.object().optional()
});
