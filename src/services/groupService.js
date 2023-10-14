import db from "../models";
const getGroups = async () => {
  try {
    let data = await db.Group.findAll({
      order: [["name", "ASC"]],
    });
    return {
      EM: "Get groups successfully",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    return {
      EM: "error from server",
      EC: "-1",
      DT: "",
    };
  }
};
module.exports = {
  getGroups,
};
