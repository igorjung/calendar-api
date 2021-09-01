// Dependencies
import Sequelize, { Model } from 'sequelize';

class Guest extends Model {
  static init(sequelize) {
    super.init(
      {
        // Associantions
        user_id: Sequelize.INTEGER,
        guest_id: Sequelize.INTEGER,
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
    this.belongsTo(models.guests, {
      foreignKey: 'guest_id',
      as: 'guest',
    });
  }
}

export default Guest;
