'use strict';

function define(sequelize, DataTypes) {
  return sequelize.define('document', {
    dorbel_user_id: { type: DataTypes.UUID, allowNull: false },
    provider: { type: DataTypes.ENUM, values: ['filestack'], allowNull: false },
    provider_file_id: { type: DataTypes.STRING, allowNull: false },
    filename: { type: DataTypes.STRING, allowNull: false },
    type: DataTypes.STRING,
    size: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: models => {
        const options = {
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        };
        models.document.belongsTo(models.listing, options);        
      }
    }
  });
}

module.exports = define;
