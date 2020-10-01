module.exports = (sequelize, type) => {
  const tema_proposicao = sequelize.define(
    "tema_proposicao",
    {
      id_proposicao_leggo: {
        type: type.STRING,
        primaryKey: true
      },
      id_tema: {
        type: type.STRING,
        primaryKey: true
      },
    },
    {
      timestamps: false,
      tableName: "tema_proposicao",
      freezeTableName: true
    }
  );

  tema_proposicao.associate = function(models) {
    tema_proposicao.belongsTo(models.proposicao, {
      foreignKey: "id_proposicao_leggo",
      through: "proposicao_tema_proposicao"
    }),
    tema_proposicao.belongsTo(models.tema, {
      foreignKey: "id_tema",
      through: "tema_tema_proposicao"
    })
  }

  return tema_proposicao;
};
