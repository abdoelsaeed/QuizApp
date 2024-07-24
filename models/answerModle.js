/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const Question = require('./questionsModle');
const AppError = require('../errFolder/err');
const User = require('./userModle');

const answerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'You must  have a user'],
  },
    quiz: {
    type: mongoose.Schema.ObjectId,
    ref: 'Quiz'  // Add this field to link Answer to Quiz
  },
  question: {
    type: mongoose.Schema.ObjectId,
    ref: 'Question',
    required: [true, 'You must  have a question'],
  },
  selectedOption: {
    type: String,
    required: [true, 'You must  have a selectedOption'],
  },
  isCorrect: {
    type: Boolean,
    required: [true, 'You must  put if the answer is correct or not'],
    default: false,
  },
  dateAnswered: {
    type: Date,
    default: Date.now,
  }, 
  score: {
    type: Number,
    default: 0
  }
});
answerSchema.pre('save', async function (next) {
  const question = await Question.findById(this.question);
  if (!question) return next(new AppError('No question found', 400));
  question.options.forEach((option) => {
    if (option.text === this.selectedOption && option.isCorrect) {
      this.isCorrect = true;
      this.score = 1;
    }
  });
  next();
});

// answerSchema.pre('save', async function (next) {
//  const answers = await this.find()
// });

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;
