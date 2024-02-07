const express = require("express");
const router = express.Router();
const validator = require('../../helpers/validator');
const create = require("./add");
const get = require("./get");
const getById = require("./getById");
const { authenticateToken } = require("../../middleware/auth.middleware");
// const update = require("./update");

router.post("/add", authenticateToken, validator("body", create.rules), create.handler);
router.post("/get", authenticateToken, get.handler);
router.post("/getById", authenticateToken, validator("body", getById.rules), getById.handler);
// router.post("/update", validator("body", update.rules), update.handler);

module.exports = router