/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
// eslint-disable-next-line import/newline-after-import, no-unused-vars
const quizSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  questions: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Question'
    }
  ],
  dateCreated: {
    type: Date,
    default: Date.now
  }
});


quizSchema.pre(/^findOne/, function(next) {
  this.populate({
    path: 'questions',
    select: 'question options ' // يمكنك اختيار الحقول التي تريد استرجاعها من الأسئلة
  });
  next();
});
const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;