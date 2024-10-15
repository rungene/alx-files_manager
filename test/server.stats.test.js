import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

const { expect } = chai;

chai.use(chaiHttp);

describe('Stats API', ()=> {
  it('should return 200 and show redis and mongo db are alive', (done) => {
    chai.request(app)
      .get('/stats')
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys(['users', 'files']);
        expect(res.body.users).to.be.a('number');
        expect(res.body.files).to.be.a('number');
        done();
      });
   });
});
