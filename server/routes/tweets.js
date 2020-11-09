const express = require("express");
const Sequelize = require("sequelize");
const router = express.Router();

const moment = require("moment");

const status = require("../config/status");
const models = require("../models/index");

const calculaMaxAtividade = require("../utils/functions");

const {
  QueryAtividadeAgregadaPorAgenda,
  QueryAtividadeAgregadaPorTemaEAgenda,
  QueryTweetsPorTemaEAgenda,
  QueryTweetsInfo
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

// Tweets de um parlamentar ordenados por engajamento
// Formato das datas: ano-mes-dia
// Se tema for undefined então todos os temas serão considerados
// Se limit for setado então apenas os n primeiros tweets serão retornados
router.get("/:id_parlamentar/texto", (req, res) => {
  const idParlamentar = req.params.id_parlamentar;
  const tema = req.query.tema;
  const interesse = req.query.interesse;
  const limit = req.query.limit;

  let dataInicial = req.query.data_inicial;
  let dataFinal = req.query.data_final;

  dataInicial = moment(dataInicial).format("YYYY-MM-DD");
  dataFinal = moment(dataFinal).format("YYYY-MM-DD");

  let query;

  query = QueryTweetsPorTemaEAgenda(
    idParlamentar,
    tema,
    interesse,
    dataInicial,
    dataFinal,
    limit
  );

  models.sequelize
    .query(query, {
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((tweets) => {
      res.status(status.SUCCESS).json(tweets);
    })
    .catch((err) => res.status(status.BAD_REQUEST).json({ err: err.message }));
});

// Recupera informações sobre a base de dados de tweets
router.get("/info", (req, res) => {
  models.sequelize
    .query(QueryTweetsInfo(), {
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((info) => {
      res.status(status.SUCCESS).json(info[0]);
    })
    .catch((err) => res.status(status.BAD_REQUEST).json({ err: err.message }));
});

module.exports = router;
