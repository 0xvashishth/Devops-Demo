const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./index'); // Your server file must use module.exports.

const { expect } = chai;
chai.use(chaiHttp);

// Tests
describe('User API Tests', () => {

    describe('GET /addUser', () => {
        it('should add a user successfully with valid name and email', done => {
            chai.request(app)
                .get('/addUser')
                .query({ name: `${Date.now()}John Doe`, email: `${Date.now()}john.doe@example.com` })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.text).to.equal('User added successfully');
                    done();
                });
        });

        it('should fail when name or email is missing', done => {
            chai.request(app)
                .get('/addUser')
                .query({ name: 'Jane Doe' }) // Missing email
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.text).to.equal('Name and email are required');
                    done();
                });
        });
    });

    describe('GET /users after adding users', () => {
        it('should return a list of users', done => {
            chai.request(app)
                .get('/users')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.greaterThan(3); // One user added earlier
                    done();
                });
        });
    });
});
