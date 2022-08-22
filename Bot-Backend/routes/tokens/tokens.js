const express = require("express");
const router = express.Router();

const t1 = require("./tokens/t1");

const t2 = require("./tokens/t2");

const t3 = require("./tokens/t3");

const t4 = require("./tokens/t4");

const t5 = require("./tokens/t5");

const t6 = require("./tokens/t6");

router.use('/t1', t1);

router.use('/t2', t2);

router.use('/t3', t3);

router.use('/t4', t4);

router.use('/t5', t5);

router.use('/t6', t6);

module.exports = router;