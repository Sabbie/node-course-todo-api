const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const todos = [{
    _id: new ObjectID(),
    text : "first test todo"
}, {
    _id: new ObjectID(),
    text : "second test todo",
    completed : true,
    completedAt : 333
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos); // return to chain the promises
    }).then(() => done());
};

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'cedric@example.com',
    password: 'userOnePass',
    tokens: [{
        access : 'auth',
        token : jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'emely@example.com',
    password: 'userTwoPass',
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save(); // a promise
        let userTwo = new User(users[1]).save(); // a promise

        return Promise.all([userOne, userTwo]) // .then will only fire when all promises in the array are resolved
    }).then(() => done());
}

module.exports = { todos, populateTodos, users, populateUsers };