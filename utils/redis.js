import { promisify } from 'util';
import { createClient } from 'redis';

/**
* RedisClient class
*/
class RedisClient {
  constructor() {
    this.client = createClient();
    this.isClientConnected = true;
    this.client.on('error', (err) => {
      console.error('Redis client failed to connect', err.message || err.toString());
      this.isClientConnected = false;
    });

    this.client.on('connect', () => {
      this.isClientConnected = true;
    });
  }

  /**
  * Checks if the connection to Redis server is active
  * @returns {boolean}
  */
  isAlive() {
    return this.isClientConnected;
  }

  /**
  * Retrives value of given Redis key
  * @param {String} key - The key for item to retrive
  * @returns {Promise<String| null>}
  */
  async get(key) {
    return promisify(this.client.GET).bind(this.client)(key);
  }

  /**
  * Sets a value of a given Redis key within given duration
  * @param {String} key - The key of the item to store
  * @param {String} value - The value to store
  * @param {Number} duration - Expiration time in seconds
  * @returns {Promise<void>}
  */
  async set(key, value, duration) {
    try {
      await promisify(this.client.SETEX).bind(this.client)(key, duration, value);
      console.log(`Successfully set the key ${key}`);
    } catch (error) {
      console.log(`Error setting the key: ${key} in Redis`, error);
    }
  }

  /**
  * Deletes a value of given key
  * @param {String} key - The key of the item to remove
  * @returns {Promise<Void>}
  */
  async del(key) {
    await promisify(this.client.DEL).bind(this.client)(key);
  }
}
const redisClient = new RedisClient();
module.exports = redisClient;
