const bcrypt = require("bcrypt");
const User = require("./../models/user");
const userRepository = require("./../repository/userRepository");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const fs = require("fs");

exports.registerUser = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = req.body;
  const image = req.file;
  console.log("username", username);
  console.log("password", password);
  console.log("image", image);
  if (!username || !password || !image)
    return res.status(400).json({
      error: "username,password or image is empty",
    });

  try {
    user.password = await bcrypt.hash(user.password, 10);
    user.image = image.path;
    userRepository
      .addUser(user)
      .then((id) => {
        return res.status(200).json({
          status: "success",
          user,
        });
      })
      .catch((err) => {
        console.log("error:", err);
        return res.status(400).json({
          status: "error",
          message: err.message,
        });
      });
  } catch (error) {
    console.log("error:", error);
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.loginUser = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password)
    return res.status(400).json({
      error: "username or password is empty",
    });
  try {
    const user = await userRepository.getUserByUsername(username);
    console.log("user:", user);
    if (!user)
      return res.status(400).send("Cannot find user with this username");

    const comparePassword = await bcrypt.compare(password, user.password);

    console.log("comparePassword:", comparePassword);

    if (comparePassword) {
      const accessToken = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );

      const refreshToken = jwt.sign(
        { username: user.username },
        process.env.JWT_RENEW
      );

      return res.json({
        userId: user.id,
        username: user.username,
        image: user.image,
        token: { accessToken: accessToken, refreshToken: refreshToken },
      });
    }

    return res.status(401).json({
      status: "error",
      message: "Wrong password",
    });
  } catch (error) {
    console.log("error:", error);
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.findAllUsers = (req, res, next) => {
  userRepository
    .getAllUser()
    .then((users) => {
      console.log("users:", users);
      res.status(200).json({
        message: "success",
        users: users,
      });
    })
    .catch((error) => {
      console.log("error:", error);
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
};

exports.removeUser = (req, res, next) => {
  const userId = req.body.userId;

  if (!userId)
    return res.status(400).json({
      error: "User id is empty",
    });

  userRepository
    .getUserWithId(userId)
    .then((user) => {
      if (!user) {
        return res.status(400).send("Cannot find user with this username");
      }

      console.log("user:", user);
      if (fs.existsSync(user.image)) {
        fs.unlinkSync(user.image);
      }
      return user.destroy();
    })
    .then((result) => {
      return res.status(200).json({
        status: "success",
        message: "Remove user and associated project successfully.",
      });
    })
    .catch((err) => {
      console.log("error:", err);
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    });
};

exports.updateUser = async (req, res, next) => {
  const image = req.file;
  const userId = req.body.userId;
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !userId || !image || !password)
    return res.status(400).json({
      error: "User id or User data, image is empty",
    });
  try {
    const newPassword = await bcrypt.hash(password, 10);
    userRepository
      .getUserWithId(userId)
      .then((user) => {
        if (!user)
          return res.status(400).send("Cannot find user with this username");
        console.log("user:", user);
        if (fs.existsSync(user.image)) {
          fs.unlinkSync(user.image);
        }
        console.log("newPassword:", newPassword);
        user.username = username;
        user.password = newPassword;
        user.image = image.path;
        return user.save();
      })
      .then((result) => {
        console.log("result:", result);
        return res.status(200).json({
          status: "success",
          message: "Update user successfully.",
        });
      })
      .catch((err) => {
        console.log("error:", err);
        return res.status(400).json({
          status: "error",
          message: err.message,
        });
      });
  } catch (error) {
    console.log("error:", err);
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
};
