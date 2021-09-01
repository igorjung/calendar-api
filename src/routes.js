// Controllers
import AuthController from './app/controllers/AuthController';

// Middlewares
// import token from './app/middlewares/token';

// Dependencies
const { Router } = require('express');

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'Welcome to Calendar API' }));

// Auth
routes.post('/auth/register', AuthController.register);
routes.post('/auth/login', AuthController.login);

export default routes;
