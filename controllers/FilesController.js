import { tmpdir } from 'os';
import { ObjectId } from 'mongodb';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const ROOT_FOLDER_ID = 0;
const acceptedType = { folder: 'folder', file: 'file', image: 'image'};
const NULL_ID = Buffer.alloc(24, '0').toString('utf-8');
const DEFAULT_ROOT_FOLDER = 'files_manager';
const mkDirAsync = promisify(mkdir);
const writeFileAsync = promisify(writeFile);
const isValidId = (id) => {
  const size = 24;
  let i = 0;
  const charRanges = [
    [48, 57], // 0 - 9
    [97, 102], // a - f
    [65, 70], // A - F
  ];
  if (typeof id !== 'string' || id.length !== size) {
    return false;  
  }
  while (i < size) {
    const c = id[i];
    const code = c.charCodeAt(0);
    if (!charRanges.some((range) => code >= range[0] && code <= range[1])) {
      return false;  
    }
    i += 1
  }
  return true;
}
export default class FilesController {
  static async postUpload(req, res) {
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
    const name = req.body ? req.body.name : null;
    const type = req.body ? req.body.type : null;
    const parentId = req.body && req.body.parentId ? req.body.parentId : ROOT_FOLDER_ID;
    const isPublic = req.body && req.body.isPublic ? req.body.isPublic : false;
    const data = req.body && req.body.data ? req.body.data : '';
    if (!name) {
      return res.status(400).send({ error: 'Missing name' });  
    }
    if (!type || !Object.values(acceptedType).includes(type)) {
      return res.status(400).send({ error: 'Missing type' });  
    }
    if (!data && type !== acceptedType.folder) {
      return res.status(400).send({ error: 'Missing data' });
    }
    if ((parentId !== ROOT_FOLDER_ID && parentId !== ROOT_FOLDER_ID.toString())) {
      const file = await (await dbClient.filesCollection().
        findOne({
           _id: new mongoDBCore.BSON.ObjectId(isValidId(parentId) ? parentId : NULL_ID), 
        });
      if (!file) {
        return res.status(400).send({ error: 'Parent not found' });  
      }
      if (file.type !== acceptedType.folder) {
        return res.status(400).send({ error: 'Parent is not a folder' });  
      }
    }
   const baseDir = `${process.env.FOLDER_PATH || ''}`.trim().length > 0
    ? process.env.FOLDER_PATH.trim()
    : joinPath(tmpdir(), DEFAULT_ROOT_FOLDER);

    const newFile = {
      userId: new mongoDBCore.BSON.ObjectId(userId),
      name,
      type,
      isPublic,
      parentId: (parentId === ROOT_FOLDER_ID) || (parentId === ROOT_FOLDER_ID.toString())
        ? '0'
        : new mongoDBCore.BSON.ObjectId(parentId),
    };

  }
}
