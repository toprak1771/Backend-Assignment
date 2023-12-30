const User = require("./../models/user");
const Project = require("./../models/project");

exports.addUser = (user) => {
  const userId = User.create({
    username: user.username,
    password: user.password,
    image: user.image,
  })
    .then((result) => {
      console.log("User add successfully.");
      return result?.dataValues?.id;
    })
    .catch((err) => {
      console.log(err);
    });
  return new Promise((resolve, reject) => {
    return resolve(userId);
  });
};

exports.getUserByUsername = (username) => {
  const query = User.findOne({ where: { username: username } })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
  return new Promise((resolve, reject) => {
    return resolve(query);
  });
};

exports.getUserWithId = (userId) => {
  const query = User.findOne({ where: { id: userId } })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
    });
  return new Promise((resolve, reject) => {
    return resolve(query);
  });
};


exports.getAllUser = () => {
  const users = User.findAll({
    include: [
      {
        model: Project,
        through: { attributes: [] },
      },
    ],
  })
    .then((users) => {
      console.log("users:", users);
      return users;
    })
    .catch((err) => {
      console.log(err);
    });
  return new Promise((resolve, reject) => {
    return resolve(users);
  });
};
