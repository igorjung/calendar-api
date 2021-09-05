// Dependencies
import * as Yup from 'yup';

// Models
import Guest from '../models/Guest';
import Event from '../models/Event';
import User from '../models/User';

class GuestController {
  async index(request, response) {
    // Query Setting
    const { eventId } = request.query;

    // Filter Setting
    const where = {};

    if (eventId) {
      where.event_id = eventId;
    }

    // Guests Exists Validation
    const guests = await Guest.findAll({
      order: [['createdAt', 'asc']],
      include: [
        {
          model: Event,
          as: 'event',
          include: [
            {
              model: User,
              as: 'user',
              attributes: { include: ['name', 'email'] },
            },
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: { include: ['name', 'email'] },
        },
      ],
      where,
    });
    if (!guests) {
      return response.json({
        error: 'Não há convidados cadastrados ainda.',
      });
    }

    return response.json(guests);
  }

  async show(request, response) {
    // Query Setting
    const { id } = request.params;

    // Guest Exists Validation
    const guest = await Guest.findOne({
      include: [
        {
          model: Event,
          as: 'event',
          include: [
            {
              model: User,
              as: 'user',
              attributes: { include: ['name', 'email'] },
            },
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: { include: ['name', 'email'] },
        },
      ],
      where: { id },
    });
    if (!guest) {
      return response.status(404).json('Convite não encontrado.');
    }

    return response.json(guest);
  }

  async store(request, response) {
    // Body Validation
    const data = request.body;

    const schema = Yup.object().shape({
      user_id: Yup.number()
        .typeError('Usuário é obrigatório.')
        .required('Usuário é obrigatório.'),
      event_id: Yup.number()
        .typeError('Evento é obrigatório.')
        .required('Evento é obrigatório.'),
    });
    if (!(await schema.validate(data))) {
      return response.status(400).json({
        error: 'Falha no cadastro do convidado, confira os dados inseridos.',
      });
    }

    // Post
    const guest = await Guest.create(data);
    return response.json(guest);
  }

  async update(request, response) {
    // Body Validation
    const data = request.body;

    const schema = Yup.object().shape({
      user_id: Yup.number()
        .typeError('Usuário é obrigatório.')
        .required('Usuário é obrigatório.'),
      event_id: Yup.number()
        .typeError('Evento é obrigatório.')
        .required('Evento é obrigatório.'),
    });
    if (!(await schema.validate(data))) {
      return response.status(400).json({
        error: 'Falha no cadastro do convidado, confira os dados inseridos.',
      });
    }

    // Guest Exists Validation
    const { id } = request.params;
    const guest = await Guest.findOne({
      where: { id },
    });
    if (!guest) {
      return response.status(400).json({
        error: 'Não foi possível encontrar o convite.',
      });
    }

    // Put
    await guest.update(request.body);
    return response.json(guest);
  }

  async delete(request, response) {
    // Guest Exists Validation
    const { id } = request.params;
    const guest = await Guest.findOne({
      where: { id },
    });
    if (!guest) {
      return response
        .status(400)
        .json({ error: 'Ocorreu um erro, tente novamente mais tarde.' });
    }

    // Destroy
    await guest.destroy();
    return response.json();
  }
}

export default new GuestController();
