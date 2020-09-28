module.exports = (sequelize, type) => {
  const tweet = sequelize.define(
    "tweet",
    {
      id_tweet: {
        type: type.STRING,
        primaryKey: true
      },
      id_parlamentar_parlametria: type.INTEGER,
      username: type.STRING,
      created_at: type.DATE,
      text: type.STRING,
      interactions: type.REAL,
      url: type.STRING,
      outrage: type.REAL,
      vagueness: type.REAL,
      argumentation: type.REAL,
      modalization: type.REAL,
      valuation: type.REAL,
      sentiment: type.REAL,
      presupposition: type.REAL,
    },
    {
      timestamps: false,
      tableName: "tweet"
    }
  );

  tweet.associate = function(models) {
    tweet.belongsTo(models.parlamentar, {
      foreignKey: "id_parlamentar_parlametria"
    }),
    tweet.hasMany(models.tweet_proposicao, {
      foreignKey: "id_tweet",
      targetKey: "id_tweet",
      as: "tweet_tweet_proposicao"
    })
  }

  return tweet;
};
