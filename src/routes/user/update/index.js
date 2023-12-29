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

    if(req.body.company_id && req.body.company_id !== '') {
      let getCompany = await makeMongoDbServiceCompany.getSingleDocumentByQuery(
        { _id: new ObjectId(req.body.company_id), status: 1 }
      )

      if(!getCompany) return sendResponse(res, null, 404,messages.invalidRequest('Unable to locate a company associated with this company_id.'))
    }
    
    let newData = {
      email: req.body.email ? req.body.email : undefined,
      first_name: req.body.first_name ? req.body.first_name : undefined,
      last_name: req.body.last_name ? req.body.last_name : undefined,
      role: req.body.role ? req.body.role : undefined,
      phone: req.body.phone ? req.body.phone : undefined,
      password: req.body.password ? bcrypt.hashSync(req.body.password, parseInt(process.env.SALT_ROUND)) : undefined,
      company_id: req.body.company_id ? req.body.company_id : undefined,
      linkedin_url: req.body.linkedin_url ? req.body.linkedin_url : undefined,
      status: req.body.status ? req.body.status : undefined,
    }

    newData = JSON.parse(JSON.stringify(newData))
    await makeMongoDbService.updateDocument(req.body.id, { $set: newData })
    return sendResponse(res, null, 200,messages.successResponse("Updated Sucessfully."))

  } catch (error) {
    console.log(error)
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  id: Joi.string().required().description("User id"),
  email: Joi.string().optional().description("email"),
  first_name: Joi.string().optional().description("first_name"),
  last_name: Joi.string().optional().description("last_name"),
  role: Joi.string().optional().description("role"),
  phone: Joi.string().optional().description("phone"),
  password: Joi.string().optional().description("password"),
  company_id: Joi.string().min(24).max(24).optional().description("company_id"),
  linkedin_url: Joi.string().optional().description("linkedin_url"),
  status: Joi.number().optional().description("status")
});
