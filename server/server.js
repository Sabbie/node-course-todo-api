const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();

// setup bodyParser middleware
app.use(bodyParser.json()); // we can now send json to our app

// post Todo route
app.post('/todos', (req, res) => {
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc); // send back the inserted todo
    }, (e) => {
        res.status(400).send(e);
    });
});

// GET todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos}); // it's better to send the array back wrapped in an object, that way you can add info
    }, (e) => {
    res.status(400).send(e);
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

module.exports = {app};