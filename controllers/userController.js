/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const catchAsync = require('../errFolder/catchAsyn');
const AppError = require('../errFolder/err');
const User = require('../models/userModle');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});


exports.getUser = catchAsync(async (req, res, next) => {
 const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('No user found',404));
  } 

  const scorePromises = user.scores.map(async score => {
    const quizId = score.quiz;
    const calculatedScore = await user.calculateAndUpdateScore(quizId);
    if (score.score !== calculatedScore) {
      score.score = calculatedScore;
    }
  });

  await Promise.all(scorePromises);
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status:'success',
    data: user
 });
});

exports.updateScore  = catchAsync(async (req, res, next) => {
  const userId = req.user.id; 
  const {quizId} = req.params;
  const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('No user found',404));
    }
    const score = await user.calculateAndUpdateScore(quizId);
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: 'success',
      data: {
        quizId,
        score
      }
    });
});
  
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.getTopStudentsForQuiz = catchAsync(async (req, res, next) => {
  const {user} = req;
    quizId = req.query.id;
    const scorePromises = user.scores.map(async score => {
    const calculatedScore = await user.calculateAndUpdateScore(quizId);
    if (score.score !== calculatedScore) {
      score.score = calculatedScore;
    }
  });

  await Promise.all(scorePromises);
  await user.save({ validateBeforeSave: false });
  const match = req.query.id?{ $match: { "scores.quiz": new mongoose.Types.ObjectId(req.query.id) } }: { $match: {} };
const topstudents = await User.aggregate([
  {
    $unwind:"$scores",
  },
  match,
  {"$sort":{"scores.score": -1}},
  {
    $group:{
      _id: "$_id",
      name:{$first:"$name"},
      email:{$first:"$email"},
      quiz: { $first: "$scores.quiz" },
      score: { $first: "$scores.score" },
    }   
  },
    { $sort: { score: -1 } }, // ترتيب المستخدمين بناءً على أعلى درجة بشكل تنازلي
    { $limit: 5 }
]);
res.status(200).json({
  status: 'success',
  data: {
    topstudents
  }
});
});