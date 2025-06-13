const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB (serverless-friendly)
let _mongoConnectionPromise;
const connectToMongo = () => {
  if (!process.env.MONGODB_URI) {
    return Promise.reject(new Error('MONGODB_URI is not set'));
  }

  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose.connection);
  }

  if (_mongoConnectionPromise) {
    return _mongoConnectionPromise;
  }

  _mongoConnectionPromise = mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('MongoDB connected...');
      return mongoose.connection;
    })
    .catch((err) => {
      _mongoConnectionPromise = undefined;
      console.log(err);
      throw err;
    });

  return _mongoConnectionPromise;
};

// Passport config
require('./src/config/passport')(passport);

// Set up EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Ensure DB is connected when running in serverless environments
app.use((req, res, next) => {
  connectToMongo().then(() => next()).catch(next);
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com'],
      imgSrc: ["'self'", 'data:', 'https://images.unsplash.com', 'https://randomuser.me', 'https://via.placeholder.com'],
      fontSrc: ["'self'", 'https://cdn.jsdelivr.net', 'https://fonts.gstatic.com'],
      frameSrc: ["'self'", 'https://www.google.com'],
      connectSrc: ["'self'"]
    }
  }
}));
app.use(xssClean());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api/', limiter);
app.use('/users/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  message: 'Too many login attempts, please try again later'
}));

// Express session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./src/routes/index'));
app.use('/users', require('./src/routes/users'));
app.use('/dashboard', require('./src/routes/dashboard'));
app.use('/payments', require('./src/routes/payments'));

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page Not Found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start server
const PORT = process.env.PORT || 3000;

if (require.main === module) {
  connectToMongo()
    .then(() => {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(() => {
      process.exitCode = 1;
    });
}

module.exports = app;
