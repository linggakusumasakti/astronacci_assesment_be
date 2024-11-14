const User = require("../models/user");

exports.getUsers = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 10;
  try {
    const totalUsers = await User.find().countDocuments();
    const users = await User.find()
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.json({
      code: 200,
      status: "success",
      message: "Success get users",
      data: {
        user: users,
        total: totalUsers,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  try {
    if (!user) {
      const error = new Error("Could not find user.");
      error.statusCode = 404;
      throw error;
    }
    res.json({
      code: 200,
      status: "success",
      message: "Success get user",
      data: user,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSearchUser = async (req, res, next) => {
  const username = req.query.username;
  const user = await User.findOne({ username: username });
  try {
    if (!user) {
      const error = new Error("Could not find user.");
      error.statusCode = 404;
      throw error;
    }
    res.json({
      code: 200,
      status: "success",
      message: "Success get user",
      data: user,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  const userId = req.params.userId;

  const firstName = req.body.first_name;
  const lastName = req.body.last_name;
  const detailInformation = req.body.detail_information;

  try {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("Could not find user.");
      error.statusCode = 404;
      throw error;
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.detailInformation = detailInformation;
    await user.save();
    res.json({
      code: 200,
      status: "success",
      message: "User updated",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
