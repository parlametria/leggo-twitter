module.exports = (sequelize, type) => {
  const tweet = sequelize.define(
    "tweet",
    {
      id_tweet: {
        type: type.STRING,
        primaryKey: true
      },
      id_parlamentar_parlametria: type.STRING,
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

  return tweet;
};
