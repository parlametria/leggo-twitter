module.exports = (sequelize, type) => {
  const tweet_proposicao = sequelize.define(
    "tweet_proposicao",
    {
      id_proposicao_leggo: {
        type: type.STRING,
        primaryKey: true
      },
      id_tweet: {
        type: type.STRING,
        primaryKey: true
      },
      sigla: {
        type: type.STRING,
        primaryKey: true
      }
    },
    {
      timestamps: false,
      tableName: "tweet_proposicao",
      freezeTableName: true
    }
  );

  tweet_proposicao.associate = function(models) {
    tweet_proposicao.belongsTo(models.proposicao, {
      foreignKey: "id_proposicao_leggo",
    }),
    tweet_proposicao.belongsTo(models.tweet, {
      foreignKey: "id_tweet"
    })
  }

  return tweet_proposicao;
};
