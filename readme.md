# Project QuizApp

## Description 😲
Implementation of RESTful APIs for QuizApp.
Data Modelling: Efficient data modeling techniques for handling quizzes, users, answers, questions.

# Features 🎖️
- Authentication with JWT (Reset Password with email)
- Login (User/Admin)
- Register
- Forgot Password
- Admin Routes
- CRUD Operations questions, answers, users
- CRUD operations for categories
- CRUD operations for users
- Pagination and search where necessary
- API Security (NoSQL Injections, XSS Attacks, http param pollution etc)
- User:You can find out your rank in the quiz
- Teachers: Certificates of appreciation are sent to all students who obtain the final grade  
- Email Notifications: Sending emails for various events like sign-up, password reset using Nodemailer  & gmail

# Technologies Used
- Node.js: JavaScript runtime built on Chrome's V8 JavaScript engine.
- Express: Fast, unopinionated, minimalist web framework for Node.js.
- Mongoose: Elegant MongoDB object modeling for Node.js.
- MongoDB: NoSQL database for storing data.
- JWT: JSON Web Token for secure user authentication.
- Pug: Template engine for server-side rendering.
- Nodemailer: Module for sending emails from Node.js applications.
- Helmet: Secure HTTP headers middleware.
- CORS: Middleware to enable Cross-Origin Resource Sharing.
- Dotenv: Module to load environment variables from a .env file.
- Bcrypt: Library to hash passwords.
- Validator: Library to validate and sanitize strings.
- mongoSanitizer: Data sanitization against nosql query injection


# 🚀 Getting Started
1. **Clone this repository to your local machine**
    ```sh
    git clone https://github.com/abdoelsaeed/QuizApp.git
    ```

2. **Install Dependencies**
    ```sh
    npm install
    ```

3. **Set Up Environment Variables**:
    Create a `.env` file in the root directory of the project and configure the required environment variables.

4. **Start the Development Server**:
    ```sh
    npm run dev
    ```
# Contributing
I welcome contributions! Please fork the repository and create a pull request with your changes.

