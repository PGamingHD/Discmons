const express = require("express");
const app = express();
const {
    connectToMongo
} = require("./handler/functions");
const mainRouter = require("./routes/router");

require("./handler/anticrash");

connectToMongo();

app.use('/', mainRouter)

app.listen(3500, () => console.log(`[EXPRESS-SERVER] <==> || Successfully started Express server at port 3500, listener ready! || <==> [EXPRESS-SERVER]`));