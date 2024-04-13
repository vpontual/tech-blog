const sequelize = require('../config/connection');
const { User, Post, Comment } = require('../models');

const userData = require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  let maxId = (await User.max('id')) || 0;
  await sequelize.query(
    `ALTER SEQUENCE user_id_seq RESTART WITH ${maxId + 1};`,
  );

  await Post.bulkCreate(postData);

  maxId = (await Post.max('id')) || 0;
  await sequelize.query(
    `ALTER SEQUENCE post_id_seq RESTART WITH ${maxId + 1};`,
  );

  await Comment.bulkCreate(commentData);

  maxId = (await Comment.max('id')) || 0;
  await sequelize.query(
    `ALTER SEQUENCE comment_id_seq RESTART WITH ${maxId + 1};`,
  );

  process.exit(0);
};

seedDatabase();
