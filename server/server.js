require('./config/config.js');


const _ = require('lodash');

const express = require('express');
const bodyParser = require('body-parser');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

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


// GET todo by id
app.get('/todos/:id', (req, res) => { // :id is a parameter
    var id = req.params.id;
    // validate ID
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo){
           return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch( (e) => {
        res.status(400).send();
    });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    // validate ID
    if (!ObjectID.isValid(id)) {
        return res.status(404).send(); // 404: not found
    }

    // remove Todo by ID
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo){
           return res.status(404).send(); // 404: not found
        }
        res.status(200).send({todo});
    }).catch( (e) => {
        res.status(400).send();
    });
});


app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    // only get the relevant properties of the object inside the req.body
    let body = _.pick(req.body, ['text', 'completed']); // _ stores lodash utilities

    if (!ObjectID.isValid(id)) {
        return res.status(404).send(); // 404: not found
    }
    // check if completed is set to true
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime(); // millisecond 1 jan 1970
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => { // new : true to return the modified document rather than the original. defaults to false
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }). catch((e) => {
        res.status(400).send();
    })
});


// POST /users
// signup
app.post('/users', (req, res) => {
    let user = new User(_.pick(req.body, ['email', 'password']));

    user.save().then(() => {
        return user.generateAuthToken(); // this returns a promise with the token as the callback argument
    }).then((token) => { // chain to the above returned promise
        res.header('x-auth', token).send(user); // 'x-...' is a custom header that HTTP doesn't necessarily support
    }).catch((e) => {
        res.status(400).send(e);
    })
});

// POST /users/login
// login
app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        //res.send(user);
       return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

// logout
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send('succesfully logged out');
    }).catch((e) => {
        res.status(400).send(e);
    })
})

// authenticate is custom middleware
app.get('/users/me', authenticate, (req,res) => {
    res.send(req.user);
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

module.exports = {app};