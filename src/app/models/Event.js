// Dependencies
import Sequelize, { Model } from 'sequelize';

class Event extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        description: Sequelize.TEXT,
        all_day: Sequelize.BOOLEAN,
        start_at: Sequelize.DATE,
        end_at: Sequelize.DATE,

        // Associantions
        user_id: Sequelize.INTEGER,
      },
      {
        modelName: 'events',
        sequelize,
      }
    );

    return this;
  }

  // Models Association
  static associate(models) {
    this.belongsTo(models.users, {
      foreignKey: 'user_id',
      as: 'user',
    });
    this.hasMany(models.guests);
  }
}

export default Event;
