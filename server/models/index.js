const Sequelize = require("sequelize");
const logger = require("heroku-logger");

// Models
const TweetModel = "./tweet.js";

if (!global.hasOwnProperty("models")) {
  const db = require("../config/env").postgresURI;

  // Connect to Postgres
  const sequelize = new Sequelize(db, {
    host: "localhost",
    dialect: "postgres",
    operatorsAliases: false,
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production'
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
