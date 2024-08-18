const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Database connected!"))
.catch(err => console.error("Database connection error:", err));

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  tags: [String]
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;