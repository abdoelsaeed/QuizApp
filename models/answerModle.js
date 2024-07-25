/* eslint-disable prettier/prettier */
/* eslint-disable global-require */
// eslint-disable-next-line prettier/prettier
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const Question = require('./questionsModle');
const AppError = require('../errFolder/err');
const Quiz = require("./quizModle");
const Email = require("../Email/email");

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
  },

});
answerSchema.statics.numQuestionCorrect = async function(quizId,userId) {
  const status = await this.aggregate([
    { $match: { quiz: quizId } },
    {$match: { user: userId }},
    { $group: { _id: '$quiz', numCorrect: { $count: {} } } },
  ]);
return status
}
answerSchema.pre('save', async function (next) {
  const question = await Question.findById(this.question);
  if (!question) return next(new AppError('No question found', 400));
  question.options.forEach((option) => {
    if (option.text === this.selectedOption && option.isCorrect) {
      this.isCorrect = true;
      this.score = 1;
    }
  });  
  // Increment the number of correct answers for the user
  next();
});
answerSchema.post('save',async function(){
  const User = mongoose.model('User')
  const user = await User.findById(this.user);
  const quiz = await Quiz.findById(this.quiz);

  quizLength=quiz.questions.length;
  const aggregate = await this.constructor.numQuestionCorrect(this.quiz,this.user);
  const numCorrectAnswer = aggregate[0].numCorrect;
 if(numCorrectAnswer===quizLength){
  const url =quiz.title;
await new Email(user,url).certificate(); 
 }
});


const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;
