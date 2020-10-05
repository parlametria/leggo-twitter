module.exports = (sequelize, type) => {
  const agenda_proposicao = sequelize.define(
    "agenda_proposicao",
    {
      id_proposicao_leggo: {
        type: type.STRING,
        primaryKey: true
      },
      id_agenda: {
        type: type.INTEGER,
        primaryKey: true
      }
    },
    {
      timestamps: false,
      tableName: "agenda_proposicao",
      freezeTableName: true
    }
  );

  agenda_proposicao.associate = function(models) {
    agenda_proposicao.belongsTo(models.proposicao, {
      foreignKey: "id_proposicao_leggo",
    }),
    agenda_proposicao.belongsTo(models.agenda, {
      foreignKey: "id_agenda"
    })
  }

  return agenda_proposicao;
};
