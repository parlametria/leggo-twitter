const express = require("express");
const router = express.Router();

const status = require("../config/status");
const models = require("../models/index");

const Tweet = models.tweet;

router.get("/", (req, res) => {
  Tweet.findAll()
  .then(tweets => res.status(status.SUCCESS).json(tweets))
  .catch(err => res.status(status.BAD_REQUEST).json({ err }));
});

router.get("/parlamentar/:id", (req, res) => {
  Tweet.findAll({
    where: {
      id_parlamentar: req.params.id
    }
  })
  .then(tweets => res.status(status.SUCCESS).json(tweets))
  .catch(err => res.status(status.BAD_REQUEST).json({ err }));
});

module.exports = router;
