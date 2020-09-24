module.exports = (sequelize, type) => {
  const tema = sequelize.define(
    "tema",
    {
      id_tema_leggo: {
        type: type.INTEGER,
        primaryKey: true
      },
      casa: type.STRING,
      casa_origem: type.STRING,
      sigla: type.STRING
    },
    {
      timestamps: false,
      tableName: "tema",
      freezeTableName: true
    }
  );

  tema.associate = function(models) {
    tema.belongsToMany(models.proposicao, {
      through: "tema_proposicao",
      foreignKey: "id_tema"
    })
  }

  return tema;
};
