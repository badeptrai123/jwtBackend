import { Op } from "sequelize";
import db from "../models";
import bcrypt from "bcryptjs";
import { getGroupWithRoles } from "./JWTService";
import { createJWT } from "../middleware/JWTAction";
require("dotenv").config();

const salt = bcrypt.genSaltSync(10);
const hashPassWord = (password) => {
  return bcrypt.hashSync(password, salt);
};
const checkPassword = (inputPassword, hashPassWord) => {
  return bcrypt.compareSync(inputPassword, hashPassWord);
};
const checkEmailExist = async (email) => {
  const user = await db.User.findOne({ where: { email } });
  if (user) {
    return true;
  }
  return false;
};
const checkPhoneExist = async (phone) => {
  const user = await db.User.findOne({
    where: { phone },
    raw: true,
  });
  console.log(user);
  if (user) {
    return true;
  }
  return false;
};
const registerNewUser = async (userData) => {
  try {
    const checkEmail = await checkEmailExist(userData.email);
    if (checkEmail) {
      return {
        EM: "Email is already exist",
        EC: "1",
      };
    }
    const checkPhone = await checkPhoneExist(userData.phone);
    if (checkPhone) {
      return {
        EM: "Phone is already exist",
        EC: "1",
      };
    }
    const passwordAfterHash = hashPassWord(userData.password);
    await db.User.create({
      email: userData.email,
      password: passwordAfterHash,
      phone: userData.phone,
      username: userData.username,
      groupId: 4,
    });
    return {
      EM: "A user is created successfully",
      EC: "0",
    };
  } catch (error) {
    return {
      EM: "Something is wrong",
      EC: "-2",
    };
  }
};
const loginUser = async (userData) => {
  try {
    console.log(
      await db.User.findAll({
        raw: true,
      })
    );
    const user = await db.User.findOne({
      where: {
        [Op.or]: [
          { email: userData.valueLogin },
          { phone: userData.valueLogin },
        ],
      },
    });
    console.log("login...");
    if (user) {
      console.log(user);
      const isPasswordCorrect = checkPassword(userData.password, user.password);
      if (isPasswordCorrect) {
        const groupWithRoles = await getGroupWithRoles(user);
        const payload = {
          email: user.email,
          groupWithRoles: groupWithRoles,
          username: user.username,
        };
        const token = await createJWT(payload);
        return {
          EM: "Ok",
          EC: "0",
          DT: {
            access_token: token,
            groupWithRoles,
            email: user.email,
            username: user.username,
          },
        };
      }
    }
    return {
      EM: "Your email/phone or password is incorrect",
      EC: "1",
      DT: "",
    };
  } catch (error) {
    return {
      EM: "Something is wrong",
      EC: "-2",
      DT: "",
    };
  }
};
module.exports = {
  registerNewUser,
  loginUser,
};
