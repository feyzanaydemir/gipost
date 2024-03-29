require('dotenv').config();
const cors = require('cors');
const path = require('path');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const filesRoute = require('./routes/files');
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const postsRoute = require('./routes/posts');
const commentsRoute = require('./routes/comments');

const app = express();

// MongoDB connection
mongoose
  .connect(process.env.DB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to database.');
  });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error.'));

// PassportJS
passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (username, password, done) => {
      User.findOne({ email: username }, (err, user) => {
        if (err) {
          done(err);
        } else if (!user) {
          done(null, false, { message: 'Incorrect email.' });
        } else {
          bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              done(null, user);
            } else {
              done(null, false, { message: 'Incorrect password.' });
            }
          });
        }
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Middlewares
app.use(
  cors({
    origin: [process.env.ORIGIN, 'http://localhost:8000'],
  })
);
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, './client/build')));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'img-src': ["'self'", 'data:', process.env.ORIGIN],
        'script-src': ["'self'", "'unsafe-inline'", process.env.ORIGIN],
      },
    },
  })
);
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      name: 'session',
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('common'));
app.use('/api/files', filesRoute);
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/posts', postsRoute);
app.use('/api/comments', commentsRoute);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build', 'index.html'));
});

app.listen(process.env.PORT || 8000, () =>
  console.log(`Server running on port ${process.env.PORT || 8000}.`)
);
