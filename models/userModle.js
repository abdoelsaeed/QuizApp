/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Answer = require('./answerModle')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validators: [validator.isEmail, 'Please validate your email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide your password'],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: 'Confirm password must match the original password.',
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'user','teacher'],
    default: 'user',
  },
    scores: [
    {
      quiz: {
        type: mongoose.Schema.ObjectId,
        ref: 'Quiz'
      },
      score: {
        type: Number,
        default: 0
      }
    }
  ],
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.methods.calculateAndUpdateScore = async function (quizId) {
  const user = this;
  // 1. احصل على جميع الإجابات الخاصة بالاختبار
  const answers = await Answer.find({
    user: user._id,
    quiz: (quizId)
  }).populate({
    path: 'question',
    select: 'options'
  });
  // 2. احسب الدرجات بناءً على الإجابات
  let score = 0;
  answers.forEach(answer => {
    let correctOption = answer.question.options.find(option => option.isCorrect);
    if (correctOption && answer.selectedOption === correctOption.text) {
      score += 1;
    }
  });
  // 3. تحديث حقل الدرجات في نموذج الـ User
  const existingScore = user.scores.find(scoreEntry => scoreEntry.quiz.equals(quizId));
  if (existingScore) {
    existingScore.score = score;
  } else {
    user.scores.push({ quiz: quizId, score });
  }

  return score;
};



userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined; // to remove confirmPassword from the output
  if (!this.isNew) this.passwordChangedAt = Date.now() - 1000;
  next();
});



userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  // this.populate({path:'scores.quiz'})
  next();
});
userSchema.pre(/^findOneAnd/,function (next) {
    this.populate({path:'scores.quiz',select:'title'})
next();
});
userSchema.methods.correctPassword = async function (
  candinatePassword,
  userPassword,
) {
  return await bcrypt.compare(candinatePassword, userPassword);
};
userSchema.methods.changePasswordAfter = function (TimeJWT) {
  if (this.passwordChangedAt) {
    const changeTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return TimeJWT < changeTime;
  }
  return false;
};

userSchema.methods.createPasswordRestToken = function () {
  const restToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(restToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return restToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
