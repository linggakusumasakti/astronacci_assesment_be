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
        lastName: lastName,
        detailInformation: detailInformation
      });
      const result = await user.save();
      const token = jwt.sign(
        {
          username: result.username,
          userId: result._id.toString()
        },
        process.env.SECRET_KEY,
      );
      res.json({
        code: 200,
        status: "success",
        message: "Success register",
        data: token,
      });
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
          username: loadedUser.username,
          userId: loadedUser._id.toString()
        },
        process.env.SECRET_KEY,
      );
      res.json({
        code: 200,
        status: "success",
        message: "Success login",
        data: token,
      });
    
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };


exports.forgotPassword = async (req, res, next) => {
  const username = req.body.username;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    user.code = code;
    await user.save();

    res.json({
      code: 200,
      status: "success",
      message: `Verification code generated`,
      data: user.code
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  const code = req.body.code;
  const password = req.body.password;
  try {
    const user = await User.findOne({ code: code });
    const hashedPw = await bcrypt.hash(password, 12);

    user.password = hashedPw;
    user.code = null;
    await user.save();

    res.json({
      code: 200,
      status: "success",
      message: "Password updated successfully",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

