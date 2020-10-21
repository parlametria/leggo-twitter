const express = require("express");
const Sequelize = require("sequelize");
const router = express.Router();

const moment = require("moment");

const status = require("../config/status");
const models = require("../models/index");

const calculaMaxAtividade = require("../utils/functions");

const {
  QueryAtividadeAgregadaPorAgenda,
  QueryAtividadeAgregadaPorTemaEAgenda
} = require("../utils/queries/tweets_queries");

const Tweet = models.tweet;

router.get("/parlamentares", (req, res) => {
  const tema = req.query.tema;
  const interesse = "congresso-remoto"; //req.query.interesse;

  const dataInicial = moment(new Date("01-02-2019")).format("YYYY-MM-DD");
  const dataFinal = moment(new Date()).format("YYYY-MM-DD");

  let query;
  if (typeof tema === "undefined" || tema === "") {
    query = QueryAtividadeAgregadaPorAgenda(
      interesse,
      dataInicial,
      dataFinal
    );
  } else {
    query = QueryAtividadeAgregadaPorTemaEAgenda(
      tema,
      interesse,
      dataInicial,
      dataFinal
    );
  }

  models.sequelize
    .query(query, {
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((tweets) => {
      res.status(status.SUCCESS).json(tweets);
    })
    .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
});

router.get("/parlamentares/:id_parlamentar", (req, res) => {
  const id_parlamentar = req.params.id_parlamentar;
  const tema = req.query.tema;
  const interesse = "congresso-remoto"; //req.query.interesse;

  const dataInicial = moment(new Date("01-02-2019")).format("YYYY-MM-DD");
  const dataFinal = moment(new Date()).format("YYYY-MM-DD");

  let query;
  if (typeof tema === "undefined" || tema === "") {
    query = QueryAtividadeAgregadaPorAgenda(
      interesse,
      dataInicial,
      dataFinal
    );
  } else {
    query = QueryAtividadeAgregadaPorTemaEAgenda(
      tema,
      interesse,
      dataInicial,
      dataFinal
    );
  }

  models.sequelize
    .query(query, {
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((tweets) => {
      res
        .status(status.SUCCESS)
        .json(calculaMaxAtividade(tweets, id_parlamentar, false));
    })
    .catch((err) => res.status(status.BAD_REQUEST).json({ err: err.message }));
});

module.exports = router;
