module.exports = (sequelize, type) => {
  const agenda = sequelize.define(
    "agenda",
    {
      id: {
        type: type.INTEGER,
        primaryKey: true
      },
      nome: type.STRING,
      slug: type.STRING
    },
    {
      timestamps: false,
      tableName: "agenda",
      freezeTableName: true
    }
  );

  agenda.associate = function(models) {
    agenda.hasMany(models.agenda_proposicao, {
      foreignKey: "id_agenda",
      targetKey: "id",
      as: "agenda_agenda_proposicao"
    })
  }

  return agenda;
};
