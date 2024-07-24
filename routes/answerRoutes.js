/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const express = require('express');
const answerController = require("../controllers/answerController");
const authController = require("../controllers/authController");

const router = express.Router();

router.route('/').post(authController.protect ,answerController.createAnswer)
.get(authController.protect,authController.authorization('teacher','admin'),answerController.getAllAnswer);
router.route('/:id').patch(authController.protect,authController.authorization('teacher','admin'),answerController.updateAnswer)
.delete(authController.protect,authController.authorization('teacher','admin'),answerController.deleteAnswer)
.get(authController.protect,authController.authorization('teacher','admin'),answerController.getAnswer);
module.exports = router;
