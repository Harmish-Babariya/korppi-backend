const express = require("express");
const router = express.Router();
const post = require("./post");
const update = require("./update");
const get = require("./get");
const getById = require("./getById");
const validator = require('../../helpers/validator');
const { authenticateToken } = require("../../middleware/auth.middleware");

router.post("/add", validator('body',post.rule), post.handler)
router.post("/update", validator('body',update.rule), update.handler)
router.post("/get", validator('body',get.rule), get.handler)
router.post("/getById", authenticateToken, validator('body',getById.rule), getById.handler)

module.exports = router