const { expect } = require('chai');
const sinon = require('sinon');
const mongodb = require('mongodb');
const dbClient = require('../utils/db');

describe('DBClient', function() {
  afterEach(function() {
    // Automatically restore all stubs after each test
    sinon.restore();
  });

  it('should initialize and connect successfully', function(done) {
    const connectStub = sinon.stub(mongodb.MongoClient.prototype, 'connect').callsFake(function(cb) {
      cb(null); // No Error
    });
    
    // Wait for the next tick to allow the callback to execute
    process.nextTick(() => {
      expect(dbClient.isAlive()).to.be.true;
      expect(connectStub.calledOnce).to.be.true;
      done();
    });
  });
  
  it('should fail to connect and isAlive returns false', function(done) {
    // Stub the connect method to simulate a connection failure
    const connectStub = sinon.stub(mongodb.MongoClient.prototype, 'connect').callsFake(function(cb) {
      cb(new Error('Failed to connect')); 
    });

    process.nextTick(() => {
      expect(dbClient.isAlive()).to.be.false;
      expect(connectStub.calledOnce).to.be.true();
      done();
    });
  });
});
