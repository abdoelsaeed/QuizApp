/* eslint-disable prettier/prettier */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable node/no-missing-require */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const express = require('express');
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();
router.post('/signup', authController.signup);
router.post('/login',authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);
router.get('/logout', authController.logout);
router.get('/myscore/:quizId', userController.updateScore);
router.get('/TopStudentsForQuiz', userController.getTopStudentsForQuiz);
router.delete('/deleteMe', userController.deleteMe);
router.patch(
  '/updateMe',
  userController.updateMe
);
router.get('/:id', userController.getUser);
module.exports = router;
