/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const AppError = require('./errFolder/err');
const globalErrorHandler = require('./controllers/errController');
const userRouter = require('./routes/userRoutes');
const quectionRouter = require('./routes/questionsRoutes');
const answerRouter = require('./routes/answerRoutes');
const quizRouter = require('./routes/quizRoutes');
//todo ماتنساش تعمل بتاعت الاسكور
const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.set('view engine', 'pug');
app.use(cookieParser());
app.use(morgan('dev'));
app.use('/api/v1/users', userRouter);
app.use('/api/v1/quections', quectionRouter);
app.use('/api/v1/answers', answerRouter);
app.use('/api/v1/quizzes', quizRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
