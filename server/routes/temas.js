const express = require("express");
const Sequelize = require("sequelize");
const router = express.Router();

const status = require("../config/status");
const models = require("../models/index");

const { AgregaTema } = require("../utils/functions");

const Tema = models.tema;
const TemaProposicao = models.tema_proposicao;
const TweetProposicao = models.tweet_proposicao;
const Proposicao = models.proposicao;

router.get("/", (req, res) => {
  Tema.findAll()
    .then((temas) => {
      res.status(status.SUCCESS).json(temas);
    })
    .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
});

module.exports = router;
