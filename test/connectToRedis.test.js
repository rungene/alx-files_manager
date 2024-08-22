const chai = require('chai');
const expect = chai.expect;
const redisClient = require('../utils/redis');

describe('RedisClient Test', async function () {
  it('should verify the Redis client is alive', function() {
    expect(redisClient.isAlive()).to.be.true;
  });

  it('should return null for a key that does\'t exists', async  function () {
    const result = await redisClient.get('myKey');
    expect(result).to.be.null;
  });
  it('should set a key with a value and an expiration time', async  function () {
    await redisClient.set('myKey', '12', 5)
    const result = await redisClient.get('myKey');
    expect(result).to.equal('12');
  });
});
