const express = require("express");
const router = express.Router();
const validator = require('../../helpers/validator');
const create = require("./add");
const update = require("./update");
const get = require("./get");
const getById = require("./getById");

router.post("/add", validator("body", create.rules), create.handler);
router.post("/update", validator("body", update.rules), update.handler);
router.post("/get", validator("body", get.rules), get.handler);
router.post("/getById", validator("body", getById.rules), getById.handler);

module.exports = router