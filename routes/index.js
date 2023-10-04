import express from 'express';
import AppController from '../controllers/AppController';

const router = express.Router();

// Define an API endpoint
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);

module.exports = router;
