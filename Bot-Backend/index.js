const express = require("express");
const app = express();
const {
    connectToMongo
} = require("./handler/functions");
const mainRouter = require("./routes/router");
const chalk = require("chalk");

require("./handler/anticrash");

connectToMongo();

app.use('/', mainRouter)

app.listen(80, () => console.log(chalk.green(`[PURCHASE-SERVER] <==> || Successfully started Purchases Server at port 80! || <==> [PURCHASE-SERVER]`)));