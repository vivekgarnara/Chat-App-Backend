const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.put('/profileUpdate/:id', authController.profileUpdate);
router.get('/getUser/:id', authController.getUser);
router.get('/getNotifications', authController.getNotifications);
router.get('/getChatUsers', authController.getChatUsers);
router.get('/getMessages', authController.getMessages);

module.exports = router;