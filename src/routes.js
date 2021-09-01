// Controllers
import AuthController from './app/controllers/AuthController';
import EventController from './app/controllers/EventController';

// Middlewares
import token from './app/middlewares/token';

// Dependencies
const { Router } = require('express');

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'Welcome to Calendar API' }));

// Auth
routes.post('/auth/register', AuthController.register);
routes.post('/auth/login', AuthController.login);

// Events
routes.get('/events', token, EventController.index);
routes.get('/events/:id', token, EventController.show);
routes.post('/events', token, EventController.store);
routes.put('/events/:id', token, EventController.update);
routes.delete('/events/:id', token, EventController.delete);

export default routes;
