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

    // FindOneAndUpdate ==> 3 arguments: filter, update, options 
    // http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#findOneAndUpdate
    db.collection('Todos').findOneAndUpdate({
            _id : new ObjectID('5b43b2e82fa2c4032efb01a0')
        }, {
            $set : { // $set is an update operator
                completed : false
            }
        }, {
            returnOriginal : false
        })
    .then(result => {
        console.log(result);
    });
    //client.close();
});