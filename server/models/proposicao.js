module.exports = (sequelize, type) => {
  const proposicao = sequelize.define(
    "proposicao",
    {
      id_proposicao_leggo: {
        type: type.INTEGER,
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
    proposicao.belongsToMany(models.tweet, {
      through: "tweet_proposicao",
      foreignKey: "id_proposicao_leggo"
    }),
    proposicao.belongsToMany(models.tema, {
      through: "tema_proposicao",
      foreignKey: "id_temaid_proposicao_leggo"
    })
  }

  return proposicao;
};
