import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import dbClient from '../utils/db';

const { expect } = chai;

chai.use(chaiHttp);

describe('Users API', ()=> {
  beforeEach(async ()=> {
    const db = await dbClient.getDB();
    const collections = await db.listCollections({ name: 'users' }).toArray();
    if (collections.length > 0){
      await db.collection('users').deleteMany({});
    }
  });
  it('should return 400 for missing email', (done) => {
    chai.request(app)
      .post('/users')
      .send({ password: 'mypass' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').equal('Missing email');
        done();
      });
   });
  it('should return 400 for missing password', (done) => {
    chai.request(app)
      .post('/users')
      .send({ email: 'user@example.com' })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').equal('Missing password');
        done();
      });
  });
  it('should return 400 for duplicate email', (done) => {
    chai.request(app)
      .post('/users')
      .send({ email: 'user@example.com', password: 'mypass' })
      .end((err, res) => {
        if (err) done(err);
        chai.request(app)
        .post('/users')
        .send({ email: 'user@example.com', password: 'mypass' })
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error').equal('Already exist');
          done();
        });
      });
   });
  it('should create a new user with correct data', (done) => {
    chai.request(app)
      .post('/users')
      .send({ email: 'newuser@example.com', password: 'mypass' })
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('email').equal('newuser@example.com');
        done();
      });
   });
});
