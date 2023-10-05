/* eslint-disable import/no-named-as-default */
import crypto from 'crypto';
import dbClient from '../utils/db';

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

    const user = await (await dbClient.usersCollection()).findOne({ email });
    if (user) {
      return res.status(400).send({
        error: 'Already exists',
      });
    }
    const hashedPassword = crypto.createHash('sha1').update(pass).digest('hex');
    const newUser = await (await dbClient.usersCollection())
      .insertOne({ email, password: hashedPassword });
    return res.status(201).send({
      id: newUser.insertedId,
      email,
    });
  }
}
