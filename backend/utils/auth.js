import jwt from 'jsonwebtoken';
import UserModel from './models/user.js';

const SECRET_KEY = 'vuex-with-token';
const EXPIRATION_DATE = '10d';

export const newToken = user => {
  const paylod = {
    username: user.name,
    _id: user._id,
  };
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: EXPIRATION_DATE,
  });
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, SECRET_KEY, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });

// middleware
export const authenticateUser = async (req, res, next) => {
  // if (!req.headers.authorization) {
  //   return res.status(401).json({ message: 'token must be included' });
  // }

  // const token = req.headers.authorization;
  // let payload;
  // try {
  //   payload = await verifyToken(token);
  // } catch (e) {
  //   return res.status(401).json({ message: 'token is invalid' });
  // }

  // const user = await UserModel.findById(payload._id)
  //   .select('-password')
  //   .lean()
  //   .exec();

  const user = await UserModel.findOne({email: 'test@abc.com'})
      .select('-password')
      .lean()
      .exec();

  if (!user) {
    return res.status(401).json({ message: 'user is not found' });
  }

  req.user = user;
  next();
};
