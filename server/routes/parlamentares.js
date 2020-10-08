const express = require("express");
const Sequelize = require("sequelize");

const moment = require("moment");

const router = express.Router();

const status = require("../config/status");
const models = require("../models/index");

const Tweet = models.tweet;
const Parlamentar = models.parlamentar;

const {
  QueryAtividadeAgregadaPorTema
} = require("../utils/queries/tweets_queries");
const tweet = require("../models/tweet");

// média por dia de tweets
// datas teste: 06-30-2019 - 12-30-2019
// mes - dia - ano 
router.get("/media", (req, res) => {

  // const id_parlamentar = req.params.id_parlamentar;
  const tema = req.query.tema;
  const interesse = "congresso-remoto"; //req.query.interesse;
  
  let dataInicial = req.query.data_inicial;
  let dataFinal = req.query.data_final;
  var dataInicialFormat = new Date(dataInicial); 
  var dataFinalFormat = new Date(dataFinal); 
  var diferenca = dataFinalFormat.getTime() - dataInicialFormat.getTime();
  var diferenca_dias = diferenca / (1000 * 3600 * 24);

  let whereClause = {
    created_at: {
      [Sequelize.Op.between]: [dataInicial, dataFinal]
    }
  }

  if (typeof tema === "undefined" || tema === "") {
    Tweet.findAll({
      group: ["id_parlamentar_parlametria"],
      attributes: [
        "id_parlamentar_parlametria",
        [
          Sequelize.fn('COUNT', Sequelize.col("id_parlamentar_parlametria")), 
          'atividade_twitter'
        ],
      ],
      where: whereClause
    })
      .then((tweets) => {
        const result = tweets.map(tweets => {
          let data = tweets.toJSON();
          console.log(data);
          data['media_tweets'] = data['atividade_twitter']/diferenca_dias;
          return data;
        });
        res.status(status.SUCCESS).json(result);
      })
      .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
  } else {
    models.sequelize
      .query(QueryAtividadeAgregadaPorTema(tema, interesse), {
        type: Sequelize.QueryTypes.SELECT,
      })
      .then((tweets) => {
        tweets = tweets.map((t) => {          
          t.atividade_twitter = parseInt(t.atividade_twitter);
          t['media_tweets'] = t['atividade_twitter']/diferenca_dias;
          return t;
        });
        res.status(status.SUCCESS).json(tweets);
      })
      .catch((err) => res.status(status.BAD_REQUEST).json({ err }));
  }
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
