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

    // db.collection('Todos').insertOne({
    //     text : 'Something to do',
    //     completed : false
    // }, (err, result) => {
    //     if (err) {
    //     return console.log('Unable to insert todo', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));  

    // });

    // db.collection('Users').insertOne({
    //     name : 'Cédric Sabbe',
    //     age : 26,
    //     location : 'Izegem'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert user', err);
    //     }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    client.close();
});