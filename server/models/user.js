const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

UserSchema.methods.removeToken = function (token) {
    let user = this;

    return user.update({
        $pull: { // pull of (remove) the tokens.token property if the token provided matches one in the tokens array of the user
            tokens: {
                token : token
            }
        }
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

UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;

    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject();
        }

        //bcrypt doesn't support promises, so we'll make one ourselves
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};


// .pre adds middleware to the model, e.g. before we save a user to the DB, we can run a function
UserSchema.pre('save', function(next) {
    let user = this;

    // check if the password of the user is modified when updating the user for example
    // if it is not modified, we have the hashed password already. We may not hash the hashed password again! Only if it is a new password!
    if (user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
});

// User model
const User = mongoose.model('User', UserSchema);

module.exports = {User};