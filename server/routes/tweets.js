const express = require("express");
const Sequelize = require("sequelize");
const router = express.Router();

const status = require("../config/status");
const models = require("../models/index");

const Tweet = models.tweet;

router.get("/parlamentares", (req, res) => {
  Tweet.findAll({
    group: ["id_parlamentar_parlametria"],
    attributes: [
      "id_parlamentar_parlametria",
      [Sequelize.fn("COUNT", Sequelize.col("id_parlamentar_parlametria")), "atividade_twitter"]
    ]
  })
  .then(tweets => res.status(status.SUCCESS).json(tweets))
  .catch(err => res.status(status.BAD_REQUEST).json({ err }));
});

router.get("/parlamentares/:id_parlamentar", (req, res) => {
  const id_parlamentar = req.params.id_parlamentar;

  Tweet.findAll({
    group: ["id_parlamentar_parlametria"],
    attributes: [
      "id_parlamentar_parlametria",
      [Sequelize.fn("COUNT", Sequelize.col("id_parlamentar_parlametria")), "atividade_twitter"]
    ],
    where: {
      id_parlamentar_parlametria: id_parlamentar
    }
  })
  .then(tweets => res.status(status.SUCCESS).json(tweets))
  .catch(err => res.status(status.BAD_REQUEST).json({ err }));
});

module.exports = router;
