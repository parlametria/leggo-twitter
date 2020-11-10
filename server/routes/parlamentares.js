const express = require("express");
const Sequelize = require("sequelize");

const moment = require("moment");

const router = express.Router();

const status = require("../config/status");
const models = require("../models/index");

const {
  QueryPercentualAtividadeAgregadaPorAgenda,
  QueryPercentualAtividadeAgregadaPorAgendaETema,
} = require("../utils/queries/percentual_tweets_queries");

const {
  QueryEngajamentoAgregadoPorAgenda,
  QueryEngajamentoAgregadoPorAgendaETema
} = require("../utils/queries/engajamento_queries");

const Tweet = models.tweet;

const {
  QueryAtividadeAgregadaPorAgenda,
  QueryAtividadeAgregadaPorTemaEAgenda
} = require("../utils/queries/tweets_queries");

router.get("/media", (req, res) => {

  const tema = req.query.tema;
  const interesse = "congresso-remoto"; //req.query.interesse;

  // mes - dia - ano
  let dataInicial = req.query.data_inicial;
  let dataFinal = req.query.data_final;

  var dataInicialFormat = new Date(dataInicial);
  var dataFinalFormat = new Date(dataFinal);

  let diferenca_meses = Math.trunc(
    Math.abs(
      moment(dataFinalFormat).diff(moment(dataInicialFormat), "months", true)
    )
  );

  if (diferenca_meses === 0) {
    diferenca_meses = 1;
  }

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
      tweets = tweets.map((t) => {
        t.atividade_twitter = parseInt(t.atividade_twitter);
        t['media_tweets'] = t['atividade_twitter'] / diferenca_meses;
        return t;
      });
      res.status(status.SUCCESS).json(tweets);
    })
    .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
});

// percentual de atividade por tema
// datas teste: 2018-01-01 a 2020-10-01
// ano-mes-dia
router.get("/percentual_atividade_agenda", (req, res) => {
  const agenda = "congresso-remoto"; // req.query.interesse;
  const tema = req.query.tema;

  let dataInicial = req.query.data_inicial;
  let dataFinal = req.query.data_final;

  dataInicial = moment(dataInicial).format("YYYY-MM-DD");
  dataFinal = moment(dataFinal).format("YYYY-MM-DD");

  let query;
  if (typeof tema === "undefined" || tema === "") {
    query = QueryPercentualAtividadeAgregadaPorAgenda(
      agenda,
      dataInicial,
      dataFinal
    );
  } else {
    query = QueryPercentualAtividadeAgregadaPorAgendaETema(
      agenda,
      tema,
      dataInicial,
      dataFinal
    );
  }

  console.log(query)

  models.sequelize
    .query(query, {
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((tweets) => {
      tweets = tweets.map((t) => {
        t.atividade_twitter = parseInt(t.atividade_twitter);
        t.percentual_atividade_twitter = t.atividade_twitter / t.total;
        return t;
      });

      res.status(status.SUCCESS).json(tweets);
    })
    .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
});

router.get("/engajamento", (req, res) => {
  const agenda = "congresso-remoto"; // req.query.interesse;
  const tema = req.query.tema;

  let dataInicial = req.query.data_inicial;
  let dataFinal = req.query.data_final;

  dataInicial = moment(dataInicial).format("YYYY-MM-DD");
  dataFinal = moment(dataFinal).format("YYYY-MM-DD");

  let query;
  if (typeof tema === "undefined" || tema === "") {
    query = QueryEngajamentoAgregadoPorAgenda(
      agenda,
      dataInicial,
      dataFinal
    );
  } else {
    query = QueryEngajamentoAgregadoPorAgendaETema(
      agenda,
      tema,
      dataInicial,
      dataFinal
    );
  }

  console.log(query)

  models.sequelize
    .query(query, {
      type: Sequelize.QueryTypes.SELECT,
    })
    .then((tweets) => {

      res.status(status.SUCCESS).json(tweets);
    })
    .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
});

router.get("/username/:id_parlamentar", (req, res) => {
  const id_parlamentar = req.params.id_parlamentar;

  Tweet.findAll({
    attributes: [
      "id_parlamentar_parlametria",
      "username"
    ],
    where: {
      id_parlamentar_parlametria: id_parlamentar
    }
  })
    .then((tweets) => {

      let data = {};
      if (tweets.length > 0) {
        data = {
          "username": tweets[0].username,
          "total_tweets": tweets.length
        };
      }

      res.status(status.SUCCESS).json(data);
    })
    .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
});

router.get("/:id_parlamentar", (req, res) => {
  const id_parlamentar = req.params.id_parlamentar;

  Tweet.findAll({
    group: ["id_parlamentar_parlametria", "created_at", "username"],
    attributes: [
      ["created_at", "data"],
      "username",
      [
        Sequelize.fn("COUNT", Sequelize.col("id_parlamentar_parlametria")),
        "atividade_twitter",
      ],
    ],
    where: {
      id_parlamentar_parlametria: id_parlamentar,
      created_at: {
        [Sequelize.Op.gte]: moment().subtract(12, 'months').format('YYYY-MM-DD')
      }
    }
  })
    .then((tweets) => {

      const data = {
        "username": tweets[0].username
      };

      data.tweets = tweets.map(function(t) {
        delete t.dataValues.username;
        return t;
      });

      res.status(status.SUCCESS).json(data);
    })
    .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
});

module.exports = router;
