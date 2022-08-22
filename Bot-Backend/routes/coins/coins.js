const express = require("express");
const router = express.Router();

const c1 = require("./coins/c1");

const c2 = require("./coins/c2");

const c3 = require("./coins/c3");

const c4 = require("./coins/c4");

router.use('/c1', c1);

router.use('/c2', c2);

router.use('/c3', c3);

router.use('/c4', c4);

module.exports = router;