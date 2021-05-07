const express = require("express");
const { Sequelize, Op } = require("sequelize");
const router = express.Router();

const moment = require("moment");

const status = require("../config/status");
const models = require("../models/index");

const Tweet = models.tweet;
const TweetProposicao = models.tweet_proposicao;

const {
  QueryProposicoesComMaisTweetsPorParlamentar,
  QueryProposicoesComMaisTweetsPorTemaEParlamentar,
  QueryProposicoesComMaisTweetsPorAgenda,
} = require("../utils/queries/proposicoes_queries");

router.get("/parlamentar/:id", (req, res) => {
  let id_parlamentar = req.params.id;
  let dataInicial = req.query.data_inicial;
  let dataFinal = req.query.data_final;
  let qtd = req.query.qtd;
  const destaque = req.query.destaque;

  dataInicial = moment(dataInicial).format("YYYY-MM-DD");
  dataFinal = moment(dataFinal).format("YYYY-MM-DD");

  const tema = req.query.tema;
  let interesse = req.query.interesse;

  if (typeof qtd === "undefined" || qtd === "") {
    qtd = "ALL";
  } else {
    qtd = "'" + qtd + "'";
  }

  let query;
  if (typeof tema === "undefined" || tema === "" || destaque === "true") {
    query = QueryProposicoesComMaisTweetsPorParlamentar(
      interesse,
      dataInicial,
      dataFinal,
      id_parlamentar,
      qtd,
      destaque
    );
  } else {
    query = QueryProposicoesComMaisTweetsPorTemaEParlamentar(
      tema,
      interesse,
      dataInicial,
      dataFinal,
      id_parlamentar,
      qtd
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

router.get("/mais-comentadas", (req, res) => {
  let dataInicial = req.query.data_inicial;
  let dataFinal = req.query.data_final;
  let qtd = req.query.qtd;

  dataInicial = moment(dataInicial).format("YYYY-MM-DD");
  dataFinal = moment(dataFinal).format("YYYY-MM-DD");

  let interesse = req.query.interesse;

  if (typeof qtd === "undefined" || qtd === "") {
    qtd = "ALL";
  }

  const query = QueryProposicoesComMaisTweetsPorAgenda(
    interesse,
    dataInicial,
    dataFinal,
    qtd
  );

  models.sequelize
    .query(query, {
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((tweets) => {
      res.status(status.SUCCESS).json(tweets);
    })
    .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
});


router.get("/", (req, res) => {
  let dataInicial = req.query.data_inicial;
  let dataFinal = req.query.data_final;

  dataInicial = moment(dataInicial).format("YYYY-MM-DD");
  dataFinal = moment(dataFinal).format("YYYY-MM-DD");

  TweetProposicao.findAll({
    attributes: [
      'id_proposicao_leggo',
      [Sequelize.fn('COUNT', Sequelize.col('tweet_proposicao.id_tweet')) ,'num_tweets'],
      [Sequelize.fn('SUM', Sequelize.col('tweet.interactions')) ,'interactions']
    ],
    group: ['tweet_proposicao.id_proposicao_leggo'],
    includeIgnoreAttributes: false,
    include: [
      {
        model: Tweet,
        attributes: ['interactions'],
        where: {
          created_at: {
            [Op.between]: [dataInicial, dataFinal]
          }
        },
        require: true
      }
    ]
   }
  )
  .then((tweets) => {
    res.status(status.SUCCESS).json(tweets);
  })
  .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
});

module.exports = router;
