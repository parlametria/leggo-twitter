const express = require("express");
const router = express.Router();

const status = require("../config/status");

router.get("/", (req, res) => {
  res.status(status.SUCCESS).json({
    status: "OK",
    qtd: 0,
    tweets: []
  });
});

module.exports = router;
