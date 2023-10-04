import dbClient from '../utils/db';
import sha1 from 'sha1';

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

    const userExists = await dbClient.checkIfUserExists(email);
    if (userExists > 0) {
      return res.status(400).send({
        error: 'Already exists',
      });
    }

    const passHash = sha1(pass);
    const newUser = await dbClient.saveUser(email, passHash);
    console.log('New User:', newUser);
    if (!newUser || !newUser.email) {
      return res.status(500).send({ error: 'Error creating user' });  
    }
    return res.status(201).send({
      email: newUser.email,
      id: newUser._id,
    });
  }
}
