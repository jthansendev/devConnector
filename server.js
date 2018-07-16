const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

// Load Models
require('./models/User');

// Load Routes
const users = require('./routes/api/users.js');
const posts = require('./routes/api/posts.js');
const profile = require('./routes/api/profile.js');

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
      useNewUrlParser: true
  })
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(err => console.log(err));

// Initialize App
const app = express();

// BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
