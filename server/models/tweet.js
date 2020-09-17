module.exports = (sequelize, type) => {
  const tweet = sequelize.define(
    "tweet",
    {
      id_tweet: {
        type: type.INTEGER,
        primaryKey: true
      },
      id_parlamentar_parlametria: type.INTEGER,
      username: type.INTEGER,
      created_at: type.DATE,
      text: type.STRING,
      interactions: type.INTEGER,
      outrage: type.INTEGER,
      vagueness: type.INTEGER,
      argumentation: type.INTEGER,
      modalization: type.INTEGER,
      valuation: type.INTEGER,
      sentiment: type.INTEGER,
      presupposition: type.INTEGER,
    },
    {
      timestamps: false,
      tableName: "tweet"
    }
  );

  return tweet;
};
