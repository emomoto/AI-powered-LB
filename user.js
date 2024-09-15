const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err);
    }
}

connectDB();

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
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, userSchemaOptions);

const User = mongoose.model('User', UserSchema);

module.exports = User;

async function findUsers() {
    try {
        const users = await User.find().lean();
        console.log(users);
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// findUsers();