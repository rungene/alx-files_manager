import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server';

const { expect } = chai;

chai.use(chaiHttp);

describe('Status API', ()=> {
  it('should return 200 and show redis and mongo db are alive', (done) => {
    chai.request(app)
      .get('/status')
      .end((err, res) => {
        if (err) done(err);
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys(['redis', 'db']);
        expect(res.body).to.have.property('redis').equal(true);
        expect(res.body).to.have.property('db').equal(true);
        done();
      });
   });
});
