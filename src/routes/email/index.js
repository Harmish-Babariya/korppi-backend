const express = require("express");
const router = express.Router();
const generate = require("./generate");
const send = require("./send");
const validator = require('../../helpers/validator');
const { authenticateToken } = require("../../middleware/auth.middleware");

router.post("/generate", validator("body", generate.rule), generate.handler);
router.post("/send", authenticateToken, validator("body", send.rule), send.handler);

module.exports = router