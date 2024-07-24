/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const catchAsync = require('../errFolder/catchAsyn');
const Quiz = require('../models/quizModle');
const Email = require("../Email/email");
const User = require("../models/userModle");
const factory = require('./handlerFactory');

exports.createQuiz = catchAsync(async (req, res, next) => {
  const Users = await User.find({role:'user'});
  const quiz = await Quiz.create(req.body);
  const emailPromises = Users.map(user =>new Email(user,`${req.protocol}://${req.get('host')}${req.originalUrl}/${quiz.id}`).sendNotification());
  await Promise.all(emailPromises);
  res.status(201).json({
    status: 'success',
    data: quiz,
  });
});

exports.updateQuiz = factory.updateOne(Quiz);
exports.getAllQuizzes = factory.getAll(Quiz);
exports.deleteQuiz = factory.deleteOne(Quiz);
exports.getQuiz = factory.getOne(Quiz);
