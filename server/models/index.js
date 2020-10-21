const Sequelize = require("sequelize");
const logger = require("heroku-logger");

// Models
const TweetModel = "./tweet.js";
const ParlamentarModel = "./parlamentar.js";
const TemaModel = "./tema.js";
const ProposicaoModel = "./proposicao.js";
const TemaProposicaoModel = "./tema_proposicao.js";
const TweetProposicaoModel = "./tweet_proposicao.js";
const AgendaModel = "./agenda.js";
const AgendaProposicaoModel = "./agenda_proposicao.js";

if (!global.hasOwnProperty("models")) {
  const db = require("../config/env").postgresURI;
  const isProduction = process.env.NODE_ENV === 'production';

  // Connect to Postgres
  const sequelize = new Sequelize(db, {
    host: "localhost",
    dialect: "postgres",
    operatorsAliases: false,
    dialectOptions: {
      ssl: isProduction ? {
        require: true,
        rejectUnauthorized: false
      }:
      false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

  global.models = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    tweet: sequelize.import(TweetModel),
    parlamentar: sequelize.import(ParlamentarModel),
    tema: sequelize.import(TemaModel),
    proposicao: sequelize.import(ProposicaoModel),
    tema_proposicao: sequelize.import(TemaProposicaoModel),
    tweet_proposicao: sequelize.import(TweetProposicaoModel),
    agenda: sequelize.import(AgendaModel),
    agenda_proposicao: sequelize.import(AgendaProposicaoModel)
    // add your other models here
  };

  Object.keys(global.models).forEach(modelName => {
    logger.log(modelName);
    if (global.models[modelName].associate) {
      global.models[modelName].associate(global.models);
    }
  });

  sequelize.sync({ force: false }).then(() => {
    logger.log("BD sincronizado");
  });
  // Retorna campos do tipo decimal como float e não como string
  Sequelize.postgres.DECIMAL.parse = function (value) { return parseFloat(value); };
}
module.exports = global.models;
