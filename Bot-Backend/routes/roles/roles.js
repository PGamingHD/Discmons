const express = require("express");
const router = express.Router();

const bronze = require("./roles/bronze");

const silver = require("./roles/silver");

const gold = require("./roles/gold");

const platinum = require("./roles/platinum");

router.use('/bronze', bronze);

router.use('/silver', silver)

router.use('/gold', gold)

router.use('/platinum', platinum)

module.exports = router;