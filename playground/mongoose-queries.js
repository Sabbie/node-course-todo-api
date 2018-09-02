const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5b86ee6e3771800da3ffcf3f11';
var userID;

// if (!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// Todo.find({ // returns an array
//     _id: id // no need to convert the id string to an object id with mongoose
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({ // returns a single document
//     _id: id // no need to convert the id string to an object id with mongoose
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found'); // if statement when we have a valid id, but the id isn't in the db. In this case the promise will return succesfully and you have to add an if statement.
//     }
//     console.log('Todo by id', todo);
// }).catch((e) => console.log(e)); // catch statement when we have an invalid id, because the promise will fail.

User.findById(userID).then((user) => {
    if (!user) {
        return console.log('User not found');
    }
    console.log('User by id', user);
}, (e) => {
    console.log(e);
})
