const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  createDate: {
    type: Date
  },
  username: {
    type: String
  },
  fullname: {
    type: String
  },
  password: {
    type: String
  },
  roles: {
    type: Array
  },
  isDeleted: { type: Boolean, default: false }
});


const User = mongoose.model('user', userSchema);

module.exports = User;