import AppController from '../controllers/AppController';
import express from 'express';

const router = express.Router();

// Define an API endpoint
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

module.exports = router;
