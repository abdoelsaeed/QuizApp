/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
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
//set secuirty http Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:', 'https:', 'ws:'],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
        scriptSrc: [
          "'self'",
          'https:',
          'http:',
          'blob:',
          'https://*.mapbox.com',
          'https://js.stripe.com',
          'https://m.stripe.network',
          'https://*.cloudflare.com'
        ],
        frameSrc: ["'self'", 'https://js.stripe.com'],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        workerSrc: [
          "'self'",
          'data:',
          'blob:',
          'https://*.tiles.mapbox.com',
          'https://api.mapbox.com',
          'https://events.mapbox.com',
          'https://m.stripe.network'
        ],
        childSrc: ["'self'", 'blob:'],
        imgSrc: [
          "'self'",
          'data:',
          'blob:',
          'https:',
          'https://q.stripe.com',
          'https://js.stripe.com',
          'https://stripe-camo.global.ssl.fastly.net',
          'https://d1wqzb5bdbcre6.cloudfront.net',
          'https://qr.stripe.com',
          'https://b.stripecdn.com',
          'https://files.stripe.com',
          'https://www.google.com'
        ], // أضف المصدر الجديد هنا
        formAction: ["'self'"],
        connectSrc: [
          "'self'",
          "'unsafe-inline'",
          'data:',
          'blob:',
          'https://*.stripe.com',
          'https://*.mapbox.com',
          'https://*.cloudflare.com/',
          'https://bundle.js:*',
          'ws://127.0.0.1:*/'
        ],
        upgradeInsecureRequests: []
      }
    }
  })
);
app.use(xss());
app.use(compression());
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
