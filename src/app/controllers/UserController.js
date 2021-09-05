// Models
import User from '../models/User';

class UserController {
  async index(request, response) {
    // Query Setting
    const { eventId } = request.query;

    // Filter Setting
    const where = {};

    if (eventId) {
      where.event_id = eventId;
    }

    // Users Exists Validation
    const users = await User.findAll({
      order: [['createdAt', 'asc']],
    });
    if (!users) {
      return response.json({
        error: 'Não há usuários cadastrados ainda.',
      });
    }

    return response.json(users);
  }
}

export default new UserController();
