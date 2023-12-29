const { sendResponse, messages } = require("../../../helpers/handleResponse")
const Joi = require('joi')
const { ObjectId } = require('mongodb');
const { User } = require("../../../models/user.model");
const makeMongoDbServiceUser = require("../../../services/db/dbService")({
	model: User,
});

exports.handler = async (req, res) => {
    try {
        if(req.user && req.user._id && !req.user.isAdmin) {
          let getUser = await makeMongoDbServiceUser.getSingleDocumentByQuery(
              { _id: new ObjectId(req.user._id), status: 1}
          )

          if(!getUser) return sendResponse(res, null, 404,messages.recordNotFound('Unable to locate a User associated with this id.'))
          
          const { password , __v, ...userData} = getUser._doc
          return sendResponse(res, null, 200, messages.successResponse(userData))
        } else {
            let getUser = await makeMongoDbServiceUser.getSingleDocumentByQuery(
                { _id: new ObjectId(req.body.userId), status: 1}
              )
        
            if(!getUser) return sendResponse(res, null, 404,messages.recordNotFound('Unable to locate a User associated with this id.'))
            
            const { password , __v, ...userData} = getUser._doc
            return sendResponse(res, null, 200, messages.successResponse(userData))
        }
		} catch (error) {
			return sendResponse(res, null, 500, messages.failureResponse());
		}
}

exports.rule = Joi.object({
    userId: Joi.string().optional().min(24).max(24).description('userId')
})