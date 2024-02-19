const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { Emails } = require("../../../models/emails.model");
const { Service } = require("../../../models/service.model");
const { ObjectId } = require("mongodb");
const generateBody = require("../../../helpers/generateBody");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Emails,
});
const makeMongoDbServiceService = require("../../../services/db/dbService")({
  model: Service,
});

exports.handler = async (req, res) => {
  try {
  let serviceId = req.body.serviceId
  let service = await makeMongoDbServiceService.getDocumentByQueryPopulate(
    {
        _id: serviceId
    }, null,
    [
        "user",
        {
            path: "company",
            populate: {
                path: "industryId",
                model: "Industry"
            }
        },
        "features",
        "benefits",
        "target_market"
    ]
  );
  service = service[0]
  let serviceName = service.title
  let companyName = service.company.name
  let title = service.title
  let price = service.price
  let offer = service.offer
  let features = service.features.map(ele => ele.description)
  let benefits = service.benefits.map(ele => ele.description)
  let userName = req.user.firstName + ' ' + req.user.lastName
  let role = req.user.role
  let email = req.user.email
  let website = service.company.websiteUrl

  if(req.body.emails) {
    req.body.emails.map(async ele => {
      let emailId = new ObjectId()
      let body = generateBody(emailId, serviceName, companyName, title, price, offer, features, benefits, userName, role, email, website)
            const emailData = {
                _id: emailId,
                companyId: ele.companyId,
                prospectId: ele.prospectId,
                userId: req.body.userId,
                sentBy: req.body.sentBy,
                body,
                subject: serviceName +" offer from " + companyName
            }
            await makeMongoDbService.createDocument(emailData)
        })
    }
    
    return sendResponse(res, null, 200, messages.successResponse());
  } catch (error) {
    console.log(error)
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
    emails: Joi.array().items({
        companyId: Joi.string().min(24).max(24).required().description("companyId"),
        prospectId: Joi.string().min(24).max(24).required().description("prospectId"),
    }).required(),
    serviceId: Joi.string().min(24).max(24).required().description("serviceId"),
    userId: Joi.string().min(24).max(24).required().description("userId"),
    sentBy: Joi.string().required().description("sentBy"),
});
