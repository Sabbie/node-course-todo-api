//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb'); // destructuring

// var user = {name: 'Cedric', age: 26};
// var {name} = user; // destructuring and pulling out the name property
// console.log(name);


MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) {
        return console.log('unable to connect to MongoDB server.');
    }
    console.log('Connected to MongoDB server');

    const db = client.db('TodoApp');

    // db.collection('Todos').find({completed: false}).toArray() // toArray returns a promise
    // .then((docs) => {
    //     console.log('Todos: ');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos.', err);
    // });
    
    // db.collection('Todos').find({
    //     // _id : '5b43b2e82fa2c4032efb01a0' doesn't work because _id isn't a string, it is an ObjectID object
    //     _id : new ObjectID('5b43b2e82fa2c4032efb01a0')
    // }).toArray() // toArray returns a promise
    // .then((docs) => {
    //     console.log('Todos: ');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos.', err);
    // });

    db.collection('Todos').find().count() // toArray returns a promise
    .then((count) => {
        console.log(`Todos count: ${count}`);
    }, (err) => {
        console.log('Unable to fetch todos.', err);
    });



    //client.close();
});