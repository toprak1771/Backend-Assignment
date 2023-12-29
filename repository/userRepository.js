const User = require("./../models/user");

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
