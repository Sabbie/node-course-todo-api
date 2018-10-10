const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

let data = {
    id : 10
};

let token = jwt.sign(data, '123abc');
console.log(token);

let decoded = jwt.verify(token, '123abc');
console.log('decoded ', decoded);

// let message = 'I am user number 3';
// let hash = SHA256(message).toString();

// console.log(`message: ${message}`);
// console.log(`hash: ${hash}`);

// var data = {
//     id: 4
// };
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'some secret').toString() // the secret is only available at the server, not the client
// };


// // Man in the middle attack
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString(); // the m.i.t.m. doesn't know the secret (the salt), so he can't recreate the correct hash.


// var resultHash = SHA256(JSON.stringify(token.data) + 'some secret').toString();

// if (resultHash === token.hash){
//     console.log('Data was not changed.');
// } else {
//     console.log('Data changed. Do not trust!');
// }

// this is all implemented in the JSON WebToken standard (JWT)