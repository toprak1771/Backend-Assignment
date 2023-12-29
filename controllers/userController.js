const bcrypt = require("bcrypt");
const User = require("./../models/user");
const userRepository = require("./../repository/userRepository");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.registerUser = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = req.body;
  const image = req.file;
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
        console.log("error:", error);
        return res.status(400).json({
          status: "error",
          message: error.message,
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
        { username: user.username },
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
