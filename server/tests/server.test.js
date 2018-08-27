const expect = require('expect');
const request = require('supertest'); // express test library

const {app} = require('./../server');  // './' relative path '../' going up one level
const {Todo} = require('./../models/todo');

// clear the database before each test
beforeEach((done) => {
    Todo.remove({}).then(() => done());
})


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
                Todo.find().then((todos) => {
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
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});