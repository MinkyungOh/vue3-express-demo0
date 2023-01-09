import bcrypt from 'bcryptjs';
import { Router } from 'express';
 
import { newToken, verifyToken } from '../utils/auth.js';
import UserModel from '../models/user.js';
import { decrypt } from '../utils/crypto.js';
 
const router = Router();
 
const _PASS = "korea";

// HTTP response status
// https://developer.mozilla.org/ko/docs/Web/HTTP/Status

router.post('/signup', async (req, res, next) => {
  console.log("post '/signup/email'");
  console.log("req.body: ", req.body);
 
  const email = req.body.email;
  const name = req.body.name;
 
  const encryptedPassword = req.body.password;
  const decryptedPassword = decrypt(_PASS, encryptedPassword);
  // encrypted Password를 DB에 저장할지...
  // 현재는 hashed Password를 저장
 
  try {
    const hashedpassword = await bcrypt.hash(decryptedPassword, 12);
    const user = new UserModel({
      email,
      password: hashedpassword,
      name
    });
    const result = await user.save();
    res.status(201).json({
      message: 'User created',
      user: result
    });
 
  } catch(err) {
    return next(err);
  }
});

router.post('/signup/email', async (req, res, next) => {
  console.log("post '/signup/email'");
  console.log("req.body: ", req.body);
  const email = req.body.email;
 
  try {
    // email이 존재하는지 체크
    const findUser = await UserModel.findOne({email: email});
    
    if(findUser !== null) {
      res.status(204).json({
        message: 'User exist',
      });
    }
    else {
      res.status(200).json({
        message: 'User not exist',
      });
    }
  } catch(err) {
    return next(err);
  }
});

router.post('/login', async (req, res, next) => {
  console.log("post '/login'");
  console.log("req.body: ", req.body);
  try {
    const user = await UserModel.findOne({email: req.body.email});
    
    const encryptedPassword = req.body.password;
    const decryptedPassword = decrypt(_PASS, encryptedPassword);
    
    if(!user) {
      console.log("401");
      res.status(401).json({
        message: 'Authentication failed. User not found.'
      });
    }
    else {
      bcrypt.compare(decryptedPassword, user.password, (err, ok) => {
        if(err) {
          console.log("500");
          res.status(500).json({
            message: 'Internal Server Error'
          });
        }
        if(ok) {
          const token = newToken(user);
          const loggedInUser = {
            email: user.email,
            name: user.name,
          };
          console.log("200");
 
          res.status(200).json({
            user: loggedInUser,
            message: 'Login Success',
            token
          });
        }
        else {
          console.log("401 401");
          res.status(401).json({
            message: 'Authentication failed. Wrong password.'
          });
        }
      })
    }
    
  } catch(err) {
    console.log(err);
    return next(err);
  }
});

router.get('/user/tok', async (req, res, next) => {
  console.log("post '/user/tok'");
 
  try {
    if (!req.headers.authorization) {
      return res.status(207).json({ message: 'token must be included' });
    }
 
    const token = req.headers.authorization;
    console.log(token);
 
    let payload = await verifyToken(token);
    if(payload === null) {
      return res.status(208).json({ message: 'token is invalid' });
    }
 
    const user = await UserModel.findById(payload._id)
      .select('-password')
      .lean()
      .exec();
    console.log(user);
 
    if(!user) {
      return res.status(204).json({ message: 'user is not found' });
    }
    
    // valid user
    res.status(200).json({ user });
 
  } catch(err) {
    return next(err);
  }
});
 
export default router;

