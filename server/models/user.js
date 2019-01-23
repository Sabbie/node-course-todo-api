const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid mail'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// override the toJSON() method, because we don't want to send the password and tokens properties back
UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject(); // converts a mongoose object to a regular object (no ._v property e.g.)

    return _.pick(userObject,['_id','email']);
};

// create instance method via the .methods property
UserSchema.methods.generateAuthToken = function() {
    var user = this; // instance methods get called with the individual document (this), lowercase user
    var access = 'auth';
    var token = jwt.sign({_id : user._id.toHexString(), access}, 'abc123').toString();

    user.tokens = user.tokens.concat([{access, token}]);
    
    return user.save().then(() => { // succes case of the promise
        return token; // this will return token as the argument in the next .then succes case
    });
};


// .statics => model methods
UserSchema.statics.findByToken = function(token){
    var User = this; // model methods get called with the model (this), uppercase User
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch(e) {
        // error case
        // return new Promise((resolve, reject) => {
        //     reject();
        // });
        // shorthand
        return Promise.reject();
    }
    // succes case
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access':'auth'
    });
};

// User model
const User = mongoose.model('User', UserSchema);

module.exports = {User};