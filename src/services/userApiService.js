// get the client
import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);
const hashPassWord = (password) => {
  return bcrypt.hashSync(password, salt);
};
const getListUser = async () => {
  try {
    let users = [];
    users = await db.User.findAll({
      attributes: ["id", "username", "email", "phone", "sex"],
      include: { model: db.Group, attributes: ["name", "description"] },
    });
    return {
      EM: "get user success",
      EC: 0,
      DT: users,
    };
  } catch (error) {
    return {
      EM: "Some things is wrong",
      EC: "-1",
      DT: [],
    };
  }
};
const getListUserWithPagination = async (page, limit) => {
  try {
    const offset = (page - 1) * limit;
    const { count, rows } = await db.User.findAndCountAll({
      attributes: ["id", "username", "email", "phone", "sex", "address"],
      include: { model: db.Group, attributes: ["name", "description", "id"] },
      order: [["id", "DESC"]],
      offset: offset,
      limit: limit,
    });
    const totalPages = Math.ceil(count / limit);
    const data = {
      totalPages,
      totalRows: count,
      users: rows,
    };
    return {
      EM: "Ok",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    return {
      EM: "Some things is wrong",
      EC: "-1",
      DT: [],
    };
  }
};
const deleteUser = async (id) => {
  try {
    await db.User.destroy({
      where: {
        id,
      },
    });
    return {
      EM: "Delete user successfully",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    return {
      EM: "Some things is wrong",
      EC: "-1",
      DT: [],
    };
  }
};
const checkEmailExist = async (email) => {
  try {
    const user = await db.User.findOne({ where: { email } });
    if (user) {
      return true;
    }
    return false;
  } catch (error) {}
};
const checkPhoneExist = async (phone) => {
  try {
    const user = await db.User.findOne({
      where: { phone },
      raw: true,
    });
    console.log(user);
    if (user) {
      return true;
    }
    return false;
  } catch (error) {}
};
const createUser = async (data) => {
  try {
    const checkEmail = await checkEmailExist(data.email);
    if (checkEmail) {
      return {
        EM: "Email is already exist",
        EC: "1",
        DT: "email",
      };
    }
    const checkPhone = await checkPhoneExist(data.phone);
    if (checkPhone) {
      return {
        EM: "Phone is already exist",
        EC: "1",
        DT: "phone",
      };
    }
    const hashAfterPassword = hashPassWord(data.password);
    await db.User.create({ ...data, password: hashAfterPassword });
    return {
      EM: "Create success",
      EC: 0,
      DT: "",
    };
  } catch (error) {
    return {
      EM: "Some things is wrong",
      EC: "-1",
      DT: [],
    };
  }
};
const getUserById = async (id) => {
  try {
    let user = {};
    user = await db.User.findOne({
      where: {
        id,
      },
    });
  } catch (error) {
    return {
      EM: "Some things is wrong",
      EC: "-1",
      DT: [],
    };
  }
};
const updateUser = async (data) => {
  try {
    if (!data.groupId) {
      return {
        EM: "Error with empty groupId",
        EC: 2,
        DT: "group",
      };
    }
    let user = await db.User.findOne({
      where: { id: data.id },
    });
    if (user) {
      await user.update({
        username: data.username,
        address: data.address,
        sex: data.sex,
        groupId: data.groupId,
      });
      return {
        EM: "Update user success",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "User not found",
        EC: 2,
        DT: "",
      };
    }
  } catch (error) {
    return {
      EM: "Some things is wrong",
      EC: "-1",
      DT: [],
    };
  }
};
module.exports = {
  createUser,
  getListUser,
  deleteUser,
  getUserById,
  getListUserWithPagination,
  updateUser,
};
