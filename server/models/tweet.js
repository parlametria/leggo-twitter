module.exports = (sequelize, type) => {
  const tweet = sequelize.define(
    "tweet",
    {
      id_tweet: {
        type: type.INTEGER,
        primaryKey: true
      },
      text: type.STRING,
    }
  );

  return tweet;
};
