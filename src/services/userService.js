// get the client
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import db from "../models";
const bluebird = require("bluebird");

const salt = bcrypt.genSaltSync(10);
const hashPassWord = (password) => {
  return bcrypt.hashSync(password, salt);
};
const createUser = async (email, password, username) => {
  try {
    const hashPassword = hashPassWord(password);
    await db.User.create({
      email,
      hashPassword,
      username,
    });
  } catch (error) {
    console.log(error);
  }
};
const getListUser = async () => {
  let users = [];
  users = await db.User.findAll();
  let newUser = await db.User.findOne({
    where: { id: 1 },
    attributes: ["id", "username", "email"],
    include: { model: db.Group, attributes: ["name", "description"] },
    raw: true,
    nest: true,
  });
  console.log(newUser);
  return users;
};
const deleteUser = async (id) => {
  await db.User.destroy({
    where: {
      id,
    },
  });
};
const getUserById = async (id) => {
  let user = {};
  user = await db.User.findOne({
    where: {
      id,
    },
  });
  return user.get({ plain: true });
};
const updateUser = async (id, email, username) => {
  await db.User.update(
    { email, username },
    {
      where: {
        id,
      },
    }
  );
};

module.exports = {
  createUser,
  getListUser,
  deleteUser,
  getUserById,
  updateUser,
};
