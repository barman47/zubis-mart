const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => {
    console.log('/register request');
    res.end();
});

module.exports = router;