/* eslint-disable prettier/prettier */
/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-unused-vars */
const AppError = require('../errFolder/err');
const catchAsync = require('../errFolder/catchAsyn');
const Answer = require('../models/answerModle');
const factory = require('./handlerFactory');

exports.createAnswer = catchAsync(async (req, res, next) => {
  if(req.user.role === 'user'){
    const userId = req.user.id;
    const answer = await Answer.create({ ...req.body, user: userId });
    res.status(201).json({
      status: 'success',
      data: answer,
    });
  }
  else
  return next(new AppError('Only users can create answers', 403)); 
});

exports.getAllAnswer = factory.getAll(Answer);
exports.getAnswer = factory.getOne(Answer);
exports.updateAnswer = factory.updateOne(Answer);
exports.deleteAnswer = factory.deleteOne(Answer);