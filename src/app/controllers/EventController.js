// Dependencies
import * as Yup from 'yup';
import { Op } from 'sequelize';
import jwt from 'jsonwebtoken';

// Configs
import authConfig from '../../config/auth';

// Models
import Event from '../models/Event';
import Guest from '../models/Guest';
import User from '../models/User';

class EventController {
  async index(request, response) {
    // Query Setting
    const { start, end, userId } = request.query;

    // Filter Setting
    const where = {};
    const where_guest = {};

    if (userId) {
      where.user_id = userId;
      where_guest.user_id = userId;
    }

    if (start && end) {
      where.start_at = {
        [Op.gte]: start,
      };
      where.end_at = {
        [Op.lte]: end,
      };
    }

    // Events Exists Validation
    const events = await Event.findAll({
      order: [['createdAt', 'asc']],
      include: [
        {
          model: Guest,
          as: 'guests',
          where: where_guest,
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              required: false,
            },
          ],
        },
      ],
      where,
    });
    if (!events) {
      return response.json({
        error: 'Não há eventos cadastrados ainda.',
      });
    }

    return response.json(events);
  }

  async show(request, response) {
    // Query Setting
    const { id } = request.params;

    // Event Exists Validation
    const event = await Event.findOne({
      include: [
        {
          model: Guest,
          as: 'guests',
          include: [
            {
              model: User,
              as: 'user',
            },
          ],
        },
      ],
      where: { id },
    });
    if (!event) {
      return response.status(404).json('Evento não encontrado.');
    }

    return response.json(event);
  }

  async store(request, response) {
    // Body Validation
    const data = request.body;

    const schema = Yup.object().shape({
      name: Yup.string()
        .typeError('Nome do evento é obrigatório.')
        .required('Nome do evento é obrigatório.'),
      description: Yup.string(),
      all_day: Yup.bool(),
      start_at: Yup.string()
        .typeError('Evento precisa ter data inicial.')
        .required('Evento precisa ter data inicial.'),
      end_at: Yup.string()
        .typeError('Evento precisa ter data final.')
        .required('Evento precisa ter data final.'),
    });
    if (!(await schema.validate(data))) {
      return response.status(400).json({
        error: 'Falha no cadastro do evento, confira os dados inseridos.',
      });
    }

    // Check Events Same Dates
    const events = await Event.findAll({
      where: {
        start_at: { [Op.gte]: data.start_at },
        end_at: { [Op.lte]: data.end_at },
      },
    });
    if (events && events.length) {
      return response.status(400).json({
        error:
          'Falha no cadastro do evento, já existe um evento cadastrado nesse período',
      });
    }

    // Add User Id
    const { authorization } = request.headers;
    const auth = authorization.split(' ')[1];
    const decoded = jwt.verify(auth, authConfig.secret);
    const userId = decoded.id;
    data.user_id = userId;

    // Post
    const event = await Event.create(data);

    return response.json(event);
  }

  async update(request, response) {
    // Body Validation
    const data = request.body;

    const schema = Yup.object().shape({
      name: Yup.string()
        .typeError('Nome do evento é obrigatório.')
        .required('Nome do evento é obrigatório.'),
      description: Yup.string(),
      all_day: Yup.bool(),
      start_at: Yup.string()
        .typeError('Evento precisa ter data inicial.')
        .required('Evento precisa ter data inicial.'),
      end_at: Yup.string()
        .typeError('Evento precisa ter data final.')
        .required('Evento precisa ter data final.'),
    });
    if (!(await schema.validate(data))) {
      return response.status(400).json({
        error: 'Falha no cadastro do evento, confira os dados inseridos.',
      });
    }

    // Event Exists Validation
    const { id } = request.params;
    const event = await Event.findOne({
      where: { id },
    });
    if (!event) {
      return response.status(400).json({
        error: 'Não foi possível encontrar o evento.',
      });
    }

    // Check Events Same Dates
    const events = await Event.findAll({
      where: {
        start_at: { [Op.gte]: data.start_at },
        end_at: { [Op.lte]: data.end_at },
        id: { [Op.ne]: data.id },
      },
    });
    if (events && events.length) {
      return response.status(400).json({
        error:
          'Falha no cadastro do evento, já existe um evento cadastrado nesse período',
      });
    }

    // Add User Id
    const { authorization } = request.headers;
    const auth = authorization.split(' ')[1];
    const decoded = jwt.verify(auth, authConfig.secret);
    const userId = decoded.id;
    data.user_id = userId;

    // Put
    await event.update(request.body);

    return response.json(event);
  }

  async delete(request, response) {
    // Event Exists Validation
    const { id } = request.params;
    const event = await Event.findOne({
      where: { id },
    });
    if (!event) {
      return response
        .status(400)
        .json({ error: 'Ocorreu um erro, tente novamente mais tarde.' });
    }

    // Destroy
    await event.destroy();

    return response.json();
  }
}

export default new EventController();
