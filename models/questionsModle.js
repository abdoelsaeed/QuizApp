/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  //! الأساله
  question: {
    type: String,
    required: [true, 'You must put a question'],
  },
  //&خيارات
  options: [
    {
      text: {
        type: String,
        required: [true, 'You must put an option'],
      },
      isCorrect: {
        type: Boolean,
        require: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, 'You must put a category'],
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: [true, 'You must put a [easy or medium or hard]'],
  },
});

const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;
