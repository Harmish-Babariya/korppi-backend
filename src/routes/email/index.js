const express = require("express");
const router = express.Router();
const generate = require("./generate");
const send = require("./send");
const get = require("./get");
const update = require("./update");
const getScheduledEmail = require("./getScheduledEmail");
const getCountByUser = require("./getCountByUser");
const dailyschedule = require("./dailySchedule");
const deleteScheduleEmail = require("./deleteScheduleEmail");
const updateSchedule = require("./updateSchedule");
const open = require("./open");
const validator = require('../../helpers/validator');
const { authenticateToken } = require("../../middleware/auth.middleware");

router.post("/generate", authenticateToken, validator("body", generate.rule), generate.handler);
router.post("/send", authenticateToken, validator("body", send.rule), send.handler);
router.post("/get", authenticateToken, validator("body", get.rule), get.handler);
router.post("/getScheduleEmails", authenticateToken, validator("body", getScheduledEmail.rule), getScheduledEmail.handler);
router.post("/getCount", authenticateToken, getCountByUser.handler);
router.post("/dailyschedule", authenticateToken, validator("body", dailyschedule.rule), dailyschedule.handler);
router.post("/dailyschedule/delete", authenticateToken, validator("body", dailyschedule.rule), dailyschedule.handler);
router.post("/schedule/delete", authenticateToken, validator("body", deleteScheduleEmail.rule), deleteScheduleEmail.handler);
router.post("/schedule/update", authenticateToken, validator("body", updateSchedule.rule), updateSchedule.handler);
router.post("/stop", authenticateToken, validator("body", dailyschedule.stopRule), dailyschedule.stopHandler);
router.get("/open/:id", open.handler);
router.post("/update", authenticateToken, validator("body", update.rule), update.handler);

module.exports = router