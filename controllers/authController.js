/* eslint-disable prettier/prettier */
/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
/* eslint-disable prettier/prettier */
/* eslint-disable no-dupe-keys */
/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const { request } = require('http');
const catchAsync = require('../errFolder/catchAsyn');
const AppError = require('../errFolder/err');
const User = require('../models/userModle');
const Email = require("../Email/email");

const signToken = (id) =>jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expiresIn: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: true, //يعني هيشتغل علي الhttps بس
    httpOnly: true, //ان مينفعش اي حد يعدل عليه هو بييجي مع الريكوست
    secure: req.secure || req.header('x-forwarded-proto') === 'https'
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.authorization = (... roles)=> {
    return async(req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    
    next();
  }};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        role: req.body.role
    });
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`
    await new Email(newUser,url).sendWelcome();
    createSendToken(newUser, 201, req, res);
    
  });

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if(!email || !password){
    return next(new AppError('please provide email and password!', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if(!user ||!(await user.correctPassword(password, user.password))){
    return next(new AppError('Incorrect email or password', 401));
  }
  createSendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
let token ;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ){

  token = req.headers.authorization.split(' ')[1];
}
else if (req.cookies.jwt){
  token = req.cookies.jwt;
}

if(!token){
  return next(new AppError('You are not logged in! please log in to get access', 401));
}
const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('the user belonging to this token does not exist', 401)
    );
  }
    if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('Your password has changed! please login again', 401)
    );
  }
req.user = currentUser;
res.locals.user = currentUser;
next();
});
exports.logout = catchAsync(async (req, res, next) => {
 res.clearCookie('jwt');
  res.status(200).json({ status: 'success' });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
const user = await User.findOne({email:req.body.email});
if (!user) {
  return next(new AppError(`No user found with this email: ${req.body.email}`, 404));
}
const resetToken = user.createPasswordRestToken();
await user.save({validateBeforeSave:false});
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  }catch(e){
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({validateBeforeSave:false});
    return next(new AppError('There was an error sending the email. Try again later!',500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

    const user = await User.findOne({passwordResetToken: hashedToken});
    if(!user) return next(new AppError('Token is invalid or has expired', 400));
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 200, req, res);

});