# WriterSup - Writing Platform

A modern, responsive website for a writing platform where users can sign up, complete onboarding tasks, make payments via M-Pesa, and access writing work after payment confirmation.

## Features

- Secure user authentication (signup/login) with email and password
- Writer dashboard showing onboarding steps and payment status
- M-Pesa payment integration with transaction code verification
- Secure access to writing work after payment confirmation
- Responsive design for all devices

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:3000`

## Security Features

- Password hashing with bcrypt
- Input validation and sanitization
- Protection against XSS attacks
- CSRF protection
- Rate limiting
- Secure HTTP headers with Helmet
- Email validation

## Technology Stack

- Node.js & Express.js (Backend)
- MongoDB (Database)
- EJS (Templating)
- Bootstrap 5 (Frontend)
- Passport.js (Authentication)
