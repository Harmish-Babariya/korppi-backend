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
      messages.successResponse("Added Successfully.")
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
