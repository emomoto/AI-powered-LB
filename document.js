const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  bufferCommands: false,
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
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

const Document = mongoose.model('Document', documentSchema);

async function fetchDocumentsEfficiently() {
  const cursor = Document.find().lean().cursor();
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
  }
}

module.exports = { Document, fetchDocumentsEfficiently };