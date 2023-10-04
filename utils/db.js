import mongodb from 'mongodb';

// eslint-disable-next-line no-unused-vars
class DBClient {
  /**
  * Creates a new DBclient instance.
  */
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    const dbUri = `mongodb://${host}:${port}/${database}`;
    this.client = new mongodb.MongoClient(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.isClientConnected = false;
    this.client.connect((err) => {
      if (err) {
        console.error('Error encounted while connecting to MongoDB', err);
      } else {
        this.isClientConnected = true;
        console.log('Connected to MongoDB');
      }
    });
  }

  /**
  * check the status of the connection to MongoDB
  * @returns {boolean}
  */
  isAlive() {
    return this.isClientConnected;
  }

  /**
  * returns the number of documents in the collection users
  * @returns {Promise<Number>}
  */
  async nbUsers() {
    const db = this.client.db();
    const userCollection = db.collection('users');
    const noDocs = await userCollection.countDocuments();
    return noDocs;
  }

  /**
  * returns the number of documents in the collection files
  * @returns {Promise<Number>}
  */
  async nbFiles() {
    const db = this.client.db();
    const fileCollection = db.collection('files');
    const noFiles = await fileCollection.countDocuments();
    return noFiles;
  }

  /**
  * saves a users in users collections
  * @param {string} email - User's email
  * @param {string} passHash - Password Hash
  * @returns {Promise<User>} - inserted user object
  */
  async saveUsers(email, passHash) {
    try {
      const db = this.client.db();
      const userCollection = db.collection('users');
      const user = {
        email: email,
        password: passHash,
    };
      const insertedUser = await userCollection.insertOne(user)
      return insertedUser.ops[0];
    } catch (error) {
      throw new Error('Error saving user: ' + error.message);
    }
  }

  /**
  * checks if user exists in user collection with given email
  * @param {string} Users email
  * @returns {Promise<Number>} Number of matching users 0 or 1
  */
  async checkIfUserExists(email) {
    const db = this.client.db();
    const userCollection = db.collection('users');
    const count = await userCollection.countDocuments({ email: email });
    return count;
  }
}


export const dbClient = new DBClient();
export default dbClient;
