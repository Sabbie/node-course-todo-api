const expect = require('expect'); // asumption library
const request = require('supertest'); // express test library

const {app} = require('./../server');  // './' relative path '../' going up one level
const {Todo} = require('./../models/todo');

const {ObjectID} = require('mongodb');

const todos = [{
    _id: new ObjectID(),
    text : "first test todo"
}, {
    _id: new ObjectID(),
    text : "second test todo"
}];

// clear the database before each test and populate it with the test todos
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos); // return to chain the promises
    }).then(() => done());
});

// POST route tests
describe('POST /todos test', () => {
    // Test 1
    it('should create a new todo', (done) => { // async test ==> use 'done'
        let text = 'Test todo text';

        //supertest
        request(app)
            .post('/todos')
            .send({text})
            .expect(200) // expect HTTP status 200
            .expect((res) => { // custom expect through callback with response argument
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => { // at the end of the test, call done()
                if (err) {
                    return done(err);
                }
                
                // if the http post request was succesfull, we still need to check if the todo is added in the DB
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));

            });
    });

    // Test 2
    it('should not create todo with invalid body data', (done) => {
        // the invalid body data is here an empty object
        
        // supertest
        request(app)
            .post('/todos')
            .send({}) //invalid body data
            .expect(400) // expect HTTP status 400
            .end((err, res) => {
                if (err) {
                 
                    return done(err);
                }
                
                // if the assumptions of the http request are correct (so the request has 400 status), check if the DB is still empty
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

// GET route tests
describe('GET /todos', () => {
    it('should get all todos', (done) => {
        //supertest
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done); // we don't need a callback function in this 'end' because we're not doing anything asynchronous
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        // supertest
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`) // toHexString converts the objectID to a string
            .expect(200) // expect http status to be 200
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });
});