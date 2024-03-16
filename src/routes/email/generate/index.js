const { sendResponse, messages } = require("../../../helpers/handleResponse");
const Joi = require("joi");
const { Emails } = require("../../../models/emails.model");
const { Service } = require("../../../models/service.model");
const { Prospects } = require("../../../models/prospects.model");
const { ObjectId } = require("mongodb");
const OpenAI = require("openai");
const generateBody = require("../../../helpers/generateBody");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: Emails,
});
const makeMongoDbServiceProspect = require("../../../services/db/dbService")({
  model: Prospects,
});
const makeMongoDbServiceService = require("../../../services/db/dbService")({
  model: Service,
});

const openai = new OpenAI({
  apiKey: process.env.CHATGPT_API_KEY,
});

async function processEmailCreation(
  serviceName,
  features,
  benefits,
  price,
  offer,
  recipientName,
  recipientCompany,
  userName,
  companyName,
  website,
  email,
  role,
  emailId,
  ele,
  req,
  serviceId
) {
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Create a email for service ${serviceName}.  These are features ${features.join(
            ","
          )}. These are benefits ${benefits.join(
            ","
          )}. Price: ${price}. Discount: ${offer}Off. recipient name is ${recipientName}.  recipient company is ${recipientCompany}. sender's name is ${userName}. sender's company is ${companyName}. sender's company website is ${website}. sender's email is ${email}. sender's role in company is ${role}. use this details only. Create email message not template. remove subject part.`,
        },
      ],
      model: "gpt-4-1106-preview",
      max_tokens: 500,
      temperature: 1,
    });

    const emailData = {
      _id: emailId,
      companyId: ele.companyId,
      prospectId: ele.prospectId,
      userId: req.body.userId,
      sentBy: req.body.sentBy,
      body: chatCompletion["choices"][0]["message"]["content"],
      subject: serviceName + " offer from " + companyName,
      service: serviceId,
    };

    await makeMongoDbService.createDocument(emailData);

    return {
      success: true,
      message: "Email created and added to the database.",
    };
  } catch (error) {
    console.error("Error processing email creation:", error);
    return { success: false, message: "Error processing email creation." };
  }
}
exports.handler = async (req, res) => {
  try {
    let serviceId = req.body.serviceId;
    let service = await makeMongoDbServiceService.getDocumentByQueryPopulate(
      {
        _id: serviceId,
      },
      null,
      [
        "user",
        {
          path: "company",
          populate: {
            path: "industryId",
            model: "Industry",
          },
        },
        "features",
        "benefits",
        "target_market",
      ]
    );
    service = service[0];
    let serviceName = service.title;
    let companyName = service.company.name;
    let title = service.title;
    let price = service.price;
    let offer = service.offer;
    let features = service.features.map((ele) => ele.description);
    let benefits = service.benefits.map((ele) => ele.description);
    let userName = req.user.firstName + " " + req.user.lastName;
    let role = req.user.role;
    let email = req.user.email;
    let website = service.company.websiteUrl;

    if (req.body.emails) {
      return req.body.emails.map(async (ele) => {
        let emailId = new ObjectId();
        let prospectData =
          await makeMongoDbServiceProspect.getSingleDocumentByIdPopulate(
            ele.prospectId,
            null,
            ["company"]
          );
        let recipientName =
          prospectData.firstName + " " + prospectData.lastName;
        let recipientCompany = prospectData.company.name;
        // let body = generateBody(emailId, serviceName, companyName, title, price, offer, features, benefits, userName, role, email, website)
        // let body = `Create a email for service ${serviceName}.  These are features ${features.join(
        //   ""
        // )}. These are benefits ${benefits.join(
        //   ""
        // )}. Price: ${price}. Discount: ${offer}Off. recipient name is ${recipientName}.  recipient company is ${recipientCompany}. sender's name is ${userName}. sender's company is ${companyName}. sender's company website is ${website}. sender's email is ${email}. sender's role in company is ${role}. use this details only. Create email message not template. remove subject part.`;
        // const chatCompletion = await openai.chat.completions.create({
        //   messages: [
        //     {
        //       role: "user",
        //       content: `Create a email for service ${serviceName}.  These are features ${features.join(
        //         ","
        //       )}. These are benefits ${benefits.join(
        //         ","
        //       )}. Price: ${price}. Discount: ${offer}Off. recipient name is ${recipientName}.  recipient company is ${recipientCompany}. sender's name is ${userName}. sender's company is ${companyName}. sender's company website is ${website}. sender's email is ${email}. sender's role in company is ${role}. use this details only. Create email message not template. remove subject part.`,
        //     },
        //   ],
        //   model: "gpt-4-1106-preview",
        //   max_tokens: 500,
        //   temperature: 1,
        // });
        // console.log(chatCompletion);
        // const emailData = {
        //   _id: emailId,
        //   companyId: ele.companyId,
        //   prospectId: ele.prospectId,
        //   userId: req.body.userId,
        //   sentBy: req.body.sentBy,
        //   body: chatCompletion["choices"][0]["message"]["content"],
        //   subject: serviceName + " offer from " + companyName,
        //   service: serviceId
        // };

        // await makeMongoDbService.createDocument(emailData);
        return processEmailCreation(
          serviceName,
          features,
          benefits,
          price,
          offer,
          recipientName,
          recipientCompany,
          userName,
          companyName,
          website,
          email,
          role,
          emailId,
          ele,
          req,
          serviceId
        ).then(() => {
          return sendResponse(res, null, 200, messages.successResponse());
        }).catch(() => {
          return sendResponse(res, null, 500, messages.failureResponse());
        });
      });
    }

  } catch (error) {
    console.log(error);
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  emails: Joi.array()
    .items({
      companyId: Joi.string()
        .min(24)
        .max(24)
        .required()
        .description("companyId"),
      prospectId: Joi.string()
        .min(24)
        .max(24)
        .required()
        .description("prospectId"),
    })
    .required(),
  serviceId: Joi.string().min(24).max(24).required().description("serviceId"),
  userId: Joi.string().min(24).max(24).required().description("userId"),
  sentBy: Joi.string().required().description("sentBy"),
});
