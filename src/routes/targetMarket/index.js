const express = require("express");
const router = express.Router();
// const post = require("./post");
// const update = require("./update");
const get = require("./get");
const validator = require('../../helpers/validator');

// router.post("/add", validator('body',post.rule), post.handler)
// router.post("/update", validator('body',update.rule), update.handler)
router.post("/get", validator('body',get.rule), get.handler)

module.exports = router