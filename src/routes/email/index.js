const express = require("express");
const router = express.Router();
const generate = require("./generate");
const send = require("./send");
const get = require("./get");
const open = require("./open");
const validator = require('../../helpers/validator');
const { authenticateToken } = require("../../middleware/auth.middleware");

router.post("/generate", authenticateToken, validator("body", generate.rule), generate.handler);
router.post("/send", authenticateToken, validator("body", send.rule), send.handler);
router.post("/get", authenticateToken, validator("body", get.rule), get.handler);
router.get("/open/:id", open.handler);

module.exports = router