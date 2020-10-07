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


// média por dia de tweets
// datas teste: 06-30-2019 - 12-30-2019
// mes - dia - ano 
router.get("/:id_parlamentar/media", (req, res) => {

  const id_parlamentar = req.params.id_parlamentar;

  let dataInicial = req.query.data_inicial;

  let dataFinal = req.query.data_final;

  var dataInicialSplit = new Date(dataInicial); 

  var dataFinalSplit = new Date(dataFinal); 

  var diferenca = dataFinalSplit.getTime() - dataInicialSplit.getTime();
  var diferenca_dias = diferenca / (1000 * 3600 * 24);

  console.log("datas");
  console.log(diferenca_dias);
  
  let whereClause = {
    created_at: {
      [Sequelize.Op.between]: [dataInicial, dataFinal]
    }
  }
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
  });
  
  module.exports = router;


module.exports = router;
