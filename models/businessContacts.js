const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const contactSchema = new Schema(
  {
    contactName: { type: String, required: true },
    contactNumber: { type: String },
    email: { type: String },
  },
  { collection: 'businessContactsList' }  
);

contactSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('BusinessContact', contactSchema);