const { Company } = require("../../../models/company.model");
const Joi = require("joi");
const makeMongoDbServiceCompany = require("../../../services/db/dbService")({
	model: Company,
});


exports.handler = (req, res) => {
    console.log(hello);
}

exports.rules = Joi.object({

});