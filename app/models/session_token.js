module.exports = (sequelize, Sequelize) => {
  const SessionToken = sequelize.define("sessionToken", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users', // Nome da tabela referenciada
        key: 'id'
      }
    },
    token: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    expiresAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    expiredAt: {
      type: Sequelize.DATE
    }
  });

  return SessionToken;
};
