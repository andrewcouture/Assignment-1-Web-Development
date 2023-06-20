const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, unique: true, default: '', trim: true, required: 'Username is required' },
    password: { type: String, default: '', trim: true, required: 'Password is required' },
    email: { type: String, default: '', trim: true, required: 'Email is required' },
  },
  { collection: 'users' } 
);

userSchema.plugin(passportLocalMongoose, { missingPasswordError: 'Wrong / Missing Password' });

module.exports = mongoose.model('User', userSchema);