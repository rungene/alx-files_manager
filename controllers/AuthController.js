export default class AuthController {
  static getConnect(req, res) {
    const authHeader = req.headers['authorization'];
    const credentialsBase64 = authHeader.split(' ')[1];
    if (!credentialsBase64)
  }
}
