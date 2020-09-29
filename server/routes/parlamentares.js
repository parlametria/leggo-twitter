const express = require("express");
const Sequelize = require("sequelize");

const moment = require("moment");

const router = express.Router();

const status = require("../config/status");
const models = require("../models/index");

const Tweet = models.tweet;
const Parlamentar = models.parlamentar;

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
