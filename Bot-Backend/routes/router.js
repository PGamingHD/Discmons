const express = require("express");
const router = express.Router();

const rolesRoute = require("./roles/roles");

const coinsRoute = require("./coins/coins");

const tokensRoute = require("./tokens/tokens");

const cancelRoute = require("./cancel/cancel");

const topggRoute = require("./topgg/dblwebhook");

router.use('/success/roles', rolesRoute);

router.use('/success/coins', coinsRoute);

router.use('/success/tokens', tokensRoute)

router.use('/cancel', cancelRoute)

router.use('/topgg/dblwebhook', topggRoute);

module.exports = router;