const chai = require('chai');
const expect = chai.expect;
const redisClient = require('../utils/redis');

describe('RedisClient Test', async function () {
  it('should verify the Redis client is alive', function() {
    expect(redisClient.isAlive()).to.be.true;
  });

  it('should return null for a key that does\'t exists', async function () {
    const result = await redisClient.get('myKey');
    expect(result).to.be.null;
  });
  it('should set a key with a value and an expiration time', async function () {
    await redisClient.set('myKey', '12', 5)
    const result = await redisClient.get('myKey');
    expect(result).to.equal('12');
  });

  it('should retrive the value before it expires', async function () {
    const result = await redisClient.get('myKey');
    expect(result).to.equal('12');
  });
  
  it('should return null after the key expires', function (done) {
    this.timeout(15000);// Set timeout for this test to 15 sec, to account for expiration time

    setTimeout(async () => {
      const result = await redisClient.get('myKey');
      expect(result).to.be.null;
      done();
    }, 10000);// Wait for 10 seconds before checking if the key has expired
  });
});
