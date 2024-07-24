/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const express = require('express');
const questionController = require("../controllers/questionController");

const authController = require("../controllers/authController");

const router = express.Router();
router.route('/').post(authController.protect,authController.authorization('teacher') ,questionController.createQuestion).get(authController.protect,questionController.getAllQuestions);
router.route('/:id').get(authController.protect,questionController.getQuestion)
.patch(authController.protect,authController.authorization('teacher'),questionController.updateQuestion)
.delete(authController.protect,authController.authorization('teacher'),questionController.deleteQuestion);
module.exports = router;
