// Dependencies
import Sequelize, { Model } from 'sequelize';

class Guest extends Model {
  static init(sequelize) {
    super.init(
      {
        // Associantions
        user_id: Sequelize.INTEGER,
        event_id: Sequelize.INTEGER,
      },
      {
        modelName: 'guests',
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
    this.belongsTo(models.events, {
      foreignKey: 'event_id',
      as: 'event',
    });
  }
}

export default Guest;
