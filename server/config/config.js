// NODE_ENV defaults to production (e.g. on Heroku)
// if we're not in Heroku, set it to 'development'
// if we're inside the mocha test suite, NODE_ENV will be set to 'test' through the package.json file
let env = process.env.NODE_ENV || 'development';
console.log('env ****** ', env);

if (env === 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}