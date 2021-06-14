const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        maxLength:100
    },
    email:{
        type:String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
