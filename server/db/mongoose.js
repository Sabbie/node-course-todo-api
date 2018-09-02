const mongoose = require('mongoose');

mongoose.Promise = global.Promise; // Tell mongoose to use the ES6 built-in promises
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp'); // no need for a callback with mongoose

module.exports = {mongoose};





// // create a Todo instance
// const newTodo = new Todo({
//     text: 'Cook dinner'
// });

// // save the instance to the database
// // mongoose automatically creates a collection 'todos' based on the model name
// newTodo.save().then((doc) => {
//     console.log('Saved todo', doc);
// }, e => {
//     console.log('Unable to save todo');
// });

// const otherTodo = new Todo({
//     text : ' Edit this video   '
// });

// otherTodo.save().then((doc) => {
//     console.log('Saved other todo', doc);
// }, e => {
//     console.log('Unable to save the todo', e);
// });

// const newUser = new User({
//     email : ' Etra.bibo@gmail.com   '
// });

// newUser.save().then((doc) => {
//     console.log('Saved new user', doc);
// }, e => {
//     console.log('Unable to save the new user', e);
// });