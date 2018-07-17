const validator = require('validator');
const isEmpty = require('lodash.isempty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  let dataFields = ['email', 'password']
  dataFields.forEach(field => {
    data[field] = !isEmpty(data[field]) ? data[field] : '';
    if (validator.isEmpty(data[field])) {
      errors[field] = `${field} field is required`;
    }
  });

  if(!validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  return {
    errors, // errors: errors
    isValid: isEmpty(errors)
  };
};