/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = 'mongodb+srv://abdoelsaeed2:12345@cluster000.h7jdjme.mongodb.net/QuizApp?retryWrites=true&w=majority&appName=Cluster000'

// الاتصال بقاعدة البيانات
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.error('DB connection error:', err));
const port = process.env.PORT || 9000;
const server = app.listen(port, () => {
  console.log(`server is running on port ${port}...`);
});
