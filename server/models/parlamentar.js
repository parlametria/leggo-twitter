module.exports = (sequelize, type) => {
  const parlamentar = sequelize.define(
    "parlamentar",
    {
      id_parlamentar_parlametria: {
        type: type.INTEGER,
        primaryKey: true
      },
      id_parlamentar: type.INTEGER,
      casa: type.STRING,
    },
    {
      timestamps: false,
      tableName: "parlamentar",
      freezeTableName: true
    }
  );

  parlamentar.associate = function(models) {
    parlamentar.hasMany(models.tweet, {
      foreignKey: "id_parlamentar_parlametria"
    })
  }

  return parlamentar;
};
