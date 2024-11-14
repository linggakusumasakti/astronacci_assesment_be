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
  lastNmae: {
    type: String,
  },
  detailInformation: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('User', userSchema);
