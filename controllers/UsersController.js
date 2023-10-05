import dbClient from '../utils/db';
import crypto from 'crypto';

export default class UsersController {
  static async postNew(req, res) {
    const email = req.body.email;
    const pass = req.body.password;
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
    const newUser = await (await dbClient.usersCollection()).insertOne({ email, password: hashedPassword });
    if (!newUser || !newUser.email) {
      return res.status(500).send({ error: 'Error creating user' });  
    }
    return res.status(201).send({
      id: newUser.insertedId, 
      email: email,
    });
  }
}
