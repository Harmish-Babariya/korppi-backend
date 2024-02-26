const express = require("express");
const router = express.Router();
const get = require("./get");
const validator = require('../../helpers/validator');

router.post("/get", validator('body',get.rule), get.handler)

module.exports = router