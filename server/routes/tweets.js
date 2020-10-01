const express = require("express");
const Sequelize = require("sequelize");
const router = express.Router();

const status = require("../config/status");
const models = require("../models/index");

const {
  AgregaTweetsPorTema,
  AgregaTweetsPorTemaEParlamentar,
} = require("../utils/functions");

const Tema = models.tema;
const TemaProposicao = models.tema_proposicao;
const Tweet = models.tweet;
const TweetProposicao = models.tweet_proposicao;
const Proposicao = models.proposicao;

router.get("/parlamentares", (req, res) => {
  const tema = req.query.tema;

  if (typeof(tema) === "undefined" || tema === "") {
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
    TemaProposicao.findAll({
      attributes: ["id_tema"],
      include: [
        {
          model: Proposicao,
          attributes: ["id_proposicao_leggo"],
          include: [
            {
              model: TweetProposicao,
              as: "proposicao_tweet_proposicao",
              attributes: ["id_tweet"],
              include: [
                {
                  model: Tweet,
                  attributes: [
                    ["id_parlamentar_parlametria", "id_parlamentar"],
                  ],
                },
              ],
            },
          ],
        },
        {
          model: Tema,
          where: {
            slug: tema,
          },
        },
      ],
    })
      .then((tweets) => {
        res.status(status.SUCCESS).json(AgregaTweetsPorTema(tweets));
      })
      .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
  }
});

router.get("/parlamentares/:id_parlamentar", (req, res) => {
  const id_parlamentar = req.params.id_parlamentar;
  const tema = req.query.tema;

  if (tema === "undefined" || tema === "") {
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
        res.status(status.SUCCESS).json(AgregaTweetsPorTemaEParlamentar(tweets, id_parlamentar, false));
      })
      .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
  } else {
    TemaProposicao.findAll({
      attributes: ["id_tema"],
      include: [
        {
          model: Proposicao,
          attributes: ["id_proposicao_leggo"],
          include: [
            {
              model: TweetProposicao,
              as: "proposicao_tweet_proposicao",
              attributes: ["id_tweet"],
              include: [
                {
                  model: Tweet,
                  attributes: [
                    ["id_parlamentar_parlametria", "id_parlamentar"],
                  ],
                },
              ],
            },
          ],
        },
        {
          model: Tema,
          where: {
            slug: tema,
          },
        },
      ],
    })
      .then((tweets) => {
        res
          .status(status.SUCCESS)
          .json(AgregaTweetsPorTemaEParlamentar(tweets, id_parlamentar, true));
      })
      .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
  }
});

module.exports = router;
