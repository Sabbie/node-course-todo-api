const mongoose = require('mongoose');


// create mongoose model of a Todo document
const Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true, // validators
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    } 
});

module.exports = {Todo};