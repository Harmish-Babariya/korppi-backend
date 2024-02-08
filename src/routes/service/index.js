const express = require("express");
const router = express.Router();
const create = require("./add");
const get = require("./get");
const getById = require("./getById");
const update = require("./update");
const validator = require('../../helpers/validator');
const { authenticateToken } = require("../../middleware/auth.middleware");

router.post("/add", authenticateToken, validator("body", create.rules), create.handler);
router.post("/get", authenticateToken, get.handler);
router.post("/getById", authenticateToken, validator("body", getById.rules), getById.handler);
router.post("/update", authenticateToken, validator("body", update.rules), update.handler);

module.exports = router