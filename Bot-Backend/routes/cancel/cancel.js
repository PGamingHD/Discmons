const express = require("express");
const router = express.Router();


router.get('/', (req, res) => {
    res.send('The order has been successfully canceled!')
});


module.exports = router;