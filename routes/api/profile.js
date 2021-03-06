const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const passport = require('passport');

// Load Models
const Profile = mongoose.model('profile');
const User = mongoose.model('users');

// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST api/profile
// @desc    Create or Edit user profile
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Get fields
  const profileFields = {};
  profileFields.user = req.user.id;

  const standardFields = [
    'handle',
    'company',
    'location',
    'bio',
    'status',
    'githubusername'
  ],
  socialFields = [
    'youtube',
    'twitter',
    'facebook',
    'linkedin',
    'instagram'
  ];

  standardFields.forEach(field => {
    if(req.body[field]) profileFields[field] = req.body[field];
  });

  profileFields.social = {};

  socialFields.forEach(field => {
    if(req.body[field]) profileFields[field] = req.body[field];
  });

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if(profile) {
        // Update
        Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true })
          .then(profile => res.json(profile));
      } else {
        // Create
        // Check if handle exists
        Profile.findOne({ handle: profileFields.handle })
          .then(profile => {
            if(profile) {
              errors.handle = 'That handle already exists';
              res.status(400).json(errors);
            }

            // Save profile
            new Profile(profileFields)
              .save()
              .then(profile => res.json(profile));
          });
      }
    });

});

module.exports = router;