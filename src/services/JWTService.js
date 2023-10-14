import db from "../models";
const getGroupWithRoles = async (user) => {
  try {
    const roles = await db.Group.findOne({
      where: {
        id: user.groupId,
      },
      attributes: ["id", "name", "description"],
      include: [
        {
          model: db.Role,
          attributes: ["id", "url", "description"],
          through: { attributes: [] },
        },
      ],
    });
    return roles ? roles : {};
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  getGroupWithRoles,
};
