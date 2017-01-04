'use strict';
const moment = require('moment');
const CLOSE_EVENT_IF_TOO_SOON_AND_NO_REGISTRATIONS_MINUTES = 90;

function define(sequelize, DataTypes) {
  return sequelize.define('open_house_event', {
    start_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    comments: {
      type: DataTypes.STRING
    },
    listing_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    publishing_user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    isOpenForRegistration: {
      type: DataTypes.VIRTUAL,
      get: function() {        
        // TODO : should business logic be in the model definition ? 
        if (moment().isAfter(this.start_time)) { // event has passed
          return false;
        }
        else if (this.registrations.length >= this.max_attendies){
          return false;
        }

        const noRegistrations = !this.registrations || this.registrations.length === 0;
        const eventTooSoon = moment().add(CLOSE_EVENT_IF_TOO_SOON_AND_NO_REGISTRATIONS_MINUTES, 'minutes').isAfter(this.start_time);
        if (noRegistrations && eventTooSoon) {
          return false;
        }
        
        return true;  
      }
    },
    max_attendies: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: models => {
        models.open_house_event.hasMany(models.registration, {
          foreignKey: {
            allowNull: false
          },
          onDelete: 'CASCADE'
        });
      }
    }
  });
}

module.exports = define;
