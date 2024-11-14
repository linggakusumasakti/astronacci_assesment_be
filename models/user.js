const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },

  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  detailInformation: {
    type: String,
  },
  code: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('User', userSchema);
