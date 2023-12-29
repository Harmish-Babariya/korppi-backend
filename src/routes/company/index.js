const express = require("express");
const router = express.Router();
const validator = require('../../helpers/validator');
const create = require("../company/create");

router.post("/add", validator("body", create.rules), create.handler);

module.exports = router