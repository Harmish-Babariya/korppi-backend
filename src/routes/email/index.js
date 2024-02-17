const express = require("express");
const router = express.Router();
const generate = require("./generate");
const validator = require('../../helpers/validator');
const { authenticateToken } = require("../../middleware/auth.middleware");

router.post("/generate", validator("body", generate.rule), generate.handler);

module.exports = router