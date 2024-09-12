const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const userSchemaOptions = {
  toJSON: { virtuals: false },
  toObject: { virtuals: false }
};

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, userSchemaOptions);

const User = mongoose.model('User', UserSchema);

module.exports = User;

User.find().lean().then(users => {
  // handle users
});