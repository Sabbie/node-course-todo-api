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

    // DeleteMany
    // db.collection('Todos').deleteMany({text : 'Eat lunch.'})
    // .then((result) => {
    //     console.log(result);
    // }, () => {

    // });

    // DeleteOne ==> deletes the first found document
    // db.collection('Todos').deleteOne({text : 'Eat lunch.'})
    // .then(result => {
    //     console.log(result);
    // })

    // FindOneAndDelete ==> also returns the deleted document
    db.collection('Todos').findOneAndDelete({completed : false})
    .then(result => {
        console.log(result);
    })

    //client.close();
});