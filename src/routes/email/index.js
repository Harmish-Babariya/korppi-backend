const express = require("express");
const router = express.Router();
const generate = require("./generate");
const send = require("./send");
const get = require("./get");
const getScheduledEmail = require("./getScheduledEmail");
const getCountByUser = require("./getCountByUser");
const dailyschedule = require("./dailySchedule");
const open = require("./open");
const validator = require('../../helpers/validator');
const { authenticateToken } = require("../../middleware/auth.middleware");

router.post("/generate", authenticateToken, validator("body", generate.rule), generate.handler);
router.post("/send", authenticateToken, validator("body", send.rule), send.handler);
router.post("/get", authenticateToken, validator("body", get.rule), get.handler);
router.post("/getScheduleEmails", authenticateToken, validator("body", getScheduledEmail.rule), getScheduledEmail.handler);
router.post("/getCount", authenticateToken, getCountByUser.handler);
router.post("/dailyschedule", authenticateToken, validator("body", dailyschedule.rule), dailyschedule.handler);
router.post("/stop", authenticateToken, validator("body", dailyschedule.stopRule), dailyschedule.stopHandler);
router.get("/open/:id", open.handler);

module.exports = router