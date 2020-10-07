const express = require("express");
const Sequelize = require("sequelize");
const router = express.Router();

const status = require("../config/status");
const models = require("../models/index");

const calculaMaxAtividade = require("../utils/functions");

const {
  QueryAtividadeAgregadaPorTema
} = require("../utils/queries/tweets_queries");

const Tweet = models.tweet;

router.get("/parlamentares", (req, res) => {
  const tema = req.query.tema;
  const interesse = "congresso-remoto"; //req.query.interesse;

  if (typeof tema === "undefined" || tema === "") {
    Tweet.findAll({
      group: ["id_parlamentar_parlametria"],
      attributes: [
        "id_parlamentar_parlametria",
        [
          Sequelize.fn("COUNT", Sequelize.col("id_parlamentar_parlametria")),
          "atividade_twitter",
        ],
      ],
    })
      .then((tweets) => res.status(status.SUCCESS).json(tweets))
      .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
  } else {
    models.sequelize
      .query(QueryAtividadeAgregadaPorTema(tema, interesse), {
        type: Sequelize.QueryTypes.SELECT,
      })
      .then((tweets) => {
        res.status(status.SUCCESS).json(tweets);
      })
      .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
  }
});

router.get("/parlamentares/:id_parlamentar", (req, res) => {
  const id_parlamentar = req.params.id_parlamentar;
  const tema = req.query.tema;
  const interesse = "congresso-remoto"; //req.query.interesse;

  if (typeof tema === "undefined" || tema === "") {
    Tweet.findAll(
      {
        group: ["id_parlamentar_parlametria"],
        attributes: [
          "id_parlamentar_parlametria",
          [
            Sequelize.fn("COUNT", Sequelize.col("id_parlamentar_parlametria")),
            "atividade_twitter",
          ],
        ],
      },
      {
        raw: true,
      }
    )
      .then((tweets) => {
        res
          .status(status.SUCCESS)
          .json(calculaMaxAtividade(tweets, id_parlamentar, true));
      })
      .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
  } else {
    models.sequelize
      .query(QueryAtividadeAgregadaPorTema(tema, interesse), {
        type: Sequelize.QueryTypes.SELECT,
      })
      .then((tweets) => {
        res
          .status(status.SUCCESS)
          .json(calculaMaxAtividade(tweets, id_parlamentar, false));
      })
      .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
  }
});

module.exports = router;
