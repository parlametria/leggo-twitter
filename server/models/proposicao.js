module.exports = (sequelize, type) => {
  const proposicao = sequelize.define(
    "proposicao",
    {
      id_proposicao_leggo: {
        type: type.STRING,
        primaryKey: true
      },
      casa: type.STRING,
      casa_origem: type.STRING,
      sigla: type.STRING
    },
    {
      timestamps: false,
      tableName: "proposicao",
      freezeTableName: true
    }
  );

  proposicao.associate = function(models) {
    proposicao.hasMany(models.tweet_proposicao, {
      foreignKey: "id_proposicao_leggo",
      targetKey: "id_proposicao_leggo",
      as: "proposicao_tweet_proposicao"
    }),
    proposicao.hasMany(models.tema_proposicao, {
      foreignKey: "id_proposicao_leggo",
      targetKey: "id_proposicao_leggo",
      as: "proposicao_tema_proposicao"
    }),
    proposicao.hasMany(models.agenda_proposicao, {
      foreignKey: "id_proposicao_leggo",
      targetKey: "id_proposicao_leggo",
      as: "proposicao_agenda_proposicao"
    })
  }

  return proposicao;
};
