const express = require("express");
const router = express.Router();
const validator = require('../../helpers/validator');
const create = require("./add");
const update = require("./update");

router.post("/add", validator("body", create.rules), create.handler);
router.post("/update", validator("body", update.rules), update.handler);

module.exports = router