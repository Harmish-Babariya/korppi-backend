const Joi = require("joi");
const { sendResponse, messages } = require("../../../helpers/handleResponse");
const { User } = require("../../../models/user.model");
const makeMongoDbService = require("../../../services/db/dbService")({
  model: User,
});
exports.handler = async (req, res) => {
  try {
    const data = {
      email: req.body.email,
      password: req.body.appPassword,
      smtpServer: "smtp.office365.com",
      smtpPort: "587",
      isActive: false,
    };

    await makeMongoDbService.findOneAndUpdateDocument(
      { _id: req.body.userId },
      {
        $push: {
          emailConfig: data,
        },
      }
    );
    return sendResponse(
      res,
      null,
      200,
      messages.successResponse({
        authUrl: `https://login.microsoftonline.com/54fde484-97f3-4b95-b065-2443a404aa5f/oauth2/v2.0/authorize?client_id=845965ff-3c1e-41ab-9133-d91ddd60ba81&response_type=code&redirect_uri=https://korppi.cloud/&response_mode=query&scope=offline_access%20User.Read%20Mail.Read%20Mail.Send&state=12345`,
      })
    );
  } catch (error) {
    return sendResponse(res, null, 500, messages.failureResponse());
  }
};

exports.rule = Joi.object({
  userId: Joi.string().min(24).max(24).required(),
  email: Joi.string().required().description("email"),
  appPassword: Joi.string().required(),
});
