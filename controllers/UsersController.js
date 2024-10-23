import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class UsersController {
  static async postNew(req, res) {
    const email = req.body ? req.body.email : null;
    const pass = req.body ? req.body.password : null;
    if (!email) {
      return res.status(400).send({
        error: 'Missing email',
      });
    }

    if (!pass) {
      return res.status(400).send({
        error: 'Missing password',
      });
    }
    try {
      const usersCollections = await dbClient.usersCollection();
      const user = await usersCollections.findOne({ email });
      if (user) {
        return res.status(400).send({
          error: 'Already exist',
        });
      }
      // 10 rounds of salting
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(pass, saltRounds);
      const { insertedId } = await usersCollections.insertOne({ email, password: hashedPassword });
      return res.status(201).send({
        id: insertedId,
        email,
      });
    } catch (error) {
      return res.status(500).send({ error: 'Internal Server Error' });
    }
  }

  static async getMe(req, res) {
    const xToken = req.header('X-Token');
    if (!xToken) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const key = `auth_${xToken}`;
    const userId = await redisClient.get(key);
    if (!userId) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const userObj = await (await dbClient.usersCollection()).findOne({ _id: ObjectId(userId) });
    const { _id, email } = userObj;
    return res.status(200).send({ id: _id, email });
  }
}
