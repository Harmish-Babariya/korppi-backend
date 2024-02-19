const Joi = require("joi");
const { Emails } = require("../../../models/emails.model");
const path = require('path');

exports.handler = async (req, res) => {
    await Emails.updateOne({_id: req.params.id}, { $set: { openAt: Date.now()}, $inc: { counts: 1 } } )
    res.sendFile(path.resolve(__dirname, '../../../../public', '1x1-00000000.png'))
    res.end()
};

exports.rule = Joi.object({
    id: Joi.string().min(24).max(24).required()
})