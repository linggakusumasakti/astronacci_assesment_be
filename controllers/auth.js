const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require('../models/user');

exports.register = async (req, res, next) => {
  const username = req.body.username;
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;
  const detailInformation = req.body.detail_information;
  const password = req.body.password;
  try {
    const hashedPw = await bcrypt.hash(password, 12);

      const user = new User({
        username: username,
        password: hashedPw,
        firstName: firstName,
        lastNmae: lastName,
        detailInformation: detailInformation
      });
      const result = await user.save();
      res.status(201).json({ message: 'User created!', userId: result._id });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    let loadedUser;
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        const error = new Error('User not be found.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        process.env.SECRET_KEY,
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };