const express = require("express");
const router = express.Router();
const get = require("./get");
const post = require("./post");
const update = require("./update");
const deleteProspect = require("./delete");
const validator = require('../../helpers/validator');

router.post("/add", validator('body',post.rule), post.handler)
router.post("/update", validator('body',update.rule), update.handler)
router.post("/delete", validator('body',deleteProspect.rule), deleteProspect.handler)
router.post("/get", validator('body',get.rule), get.handler)

module.exports = router