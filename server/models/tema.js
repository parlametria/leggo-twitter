module.exports = (sequelize, type) => {
  const tema = sequelize.define(
    "tema",
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
      tableName: "tema",
      freezeTableName: true
    }
  );

  tema.associate = function(models) {
    tema.hasMany(models.tema_proposicao, {
      foreignKey: "id_tema",
      targetKey: "id_tema",
      as: "tema_tema_proposicao"
    })
  }

  return tema;
};
