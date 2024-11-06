import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';
import dbClient from '../utils/db';

const { expect } = chai;

chai.use(chaiHttp);

describe('Testing Connect', ()=> {
  beforeEach(async ()=> {
    const db = await dbClient.getDB();
    const collections = await db.listCollections({ name: 'users' }).toArray();
    if (collections.length > 0){
      await db.collection('users').deleteMany({});
    }
  });
  it('should return 401 for missing Base64 credentials', (done) => {
    chai.request(app)
      .get('/connect')
      .set( 'Authorization', '')
      .then((res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').equal('Unauthorized');
        done();
      })
      .catch((err) => done(err));
   });
  it('should return 401 for incomplete Base64 credentials', (done) => {
    chai.request(app)
      .get('/connect')
      .set( 'Authorization', 'Basic')
      .then((res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').equal('Unauthorized');
        done();
      })
      .catch((err) => done(err));
   });
  it('should return 401 for missing email in Base64 credentials', (done) => {
    chai.request(app)
      .get('/connect')
      .set( 'Authorization', 'Basic OnRvdG8xMjM0IQ==')
      .then((res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').equal('Unauthorized');
        done();
      })
      .catch((err) => done(err));
   });
  it('should return 401 for missing password in Base64 credentials', (done) => {
    chai.request(app)
      .get('/connect')
      .set( 'Authorization', 'Basic Ym9iQGR5bGFuLmNvbTo=')
      .then((res) => {
        expect(res).to.have.status(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').equal('Unauthorized');
        done();
      })
      .catch((err) => done(err));
   });
  it('should retun 401 if user is not found(Wrong Email)', (done) => {
    chai.request(app)
      .post('/users')
      .send({ email: 'newuser@example.com', password: 'mypass' })
      .end((err, res) => {
        if (err) done(err);
        chai.request(app)
          .get('/connect')
          .set('Authorization', 'Basic dXNlckBleGFtcGxlLmNvbTpteXBhc3M=')
          .then((res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error').equal('Unauthorized');
            done();
          })
          .catch((err) => done(err));
      });
   });
  it('should retun 401 if user is not found(Wrong Password)', (done) => {
    chai.request(app)
      .post('/users')
      .send({ email: 'newuser@example.com', password: 'mypass' })
      .end((err, res) => {
        if (err) done(err);
        chai.request(app)
          .get('/connect')
          .set('Authorization', 'Basic bmV3dXNlckBleGFtcGxlLmNvbTpwYXNz')
          .then((res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('error').equal('Unauthorized');
            done();
          })
          .catch((err) => done(err));
      });
   });
});
