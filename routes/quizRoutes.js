/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const express = require('express');
const authController = require("../controllers/authController");
const questionController = require("../controllers/quizController");
const router = express.Router();
router.post('/',authController.protect,authController.authorization('teacher'),questionController.createQuiz);
router.get('/:id', authController.protect, questionController.getQuiz);
router.get('/',authController.protect, questionController.getAllQuizzes);
router.delete('/deletequiz/:id',authController.protect,authController.authorization('teacher'),questionController.deleteQuiz);
router.patch('/updatequiz/:id',authController.protect,authController.authorization('teacher'),questionController.updateQuiz);
module.exports = router;