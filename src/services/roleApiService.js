import db from "../models/index";

const getListRole = async () => {
  try {
    let data = await db.Role.findAll({
      order: [["id", "DESC"]],
    });
    return {
      EM: "get role success",
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
const createRole = async (roles) => {
  try {
    const currentRoles = await db.Role.findAll({
      attributes: ["url", "description"],
      raw: true,
    });

    const persists = roles.filter(
      ({ url: url1 }) => !currentRoles.some(({ url: url2 }) => url1 === url2)
    );
    if (persists.length === 0) {
      return {
        EM: "Nothing to create...",
        EC: 0,
        DT: [],
      };
    }
    await db.Role.bulkCreate(persists);
    return {
      EM: `Create role succeeds: ${persists.length} roles`,
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
const getRoleById = async (id) => {
  try {
    let role = {};
    role = await db.Role.findOne({
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
const updateRole = async (data) => {
  try {
    let role = await db.Role.findOne({
      where: { id: data.id },
    });
    if (role) {
      await role.update({
        url: data.url,
        description: data.description,
      });
      return {
        EM: "Update role success",
        EC: 0,
        DT: [],
      };
    } else {
      return {
        EM: "Role not found",
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
const deleteRole = async (id) => {
  try {
    await db.Role.destroy({
      where: {
        id,
      },
    });
    return {
      EM: "Delete role successfully",
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
const getRoleByGroup = async (groupId) => {
  try {
    if (!groupId) {
      return {
        EM: "Not found any roles",
        EC: 0,
        DT: [],
      };
    }
    let roles = await db.Group.findOne({
      where: {
        id: groupId,
      },
      attributes: ["id", "name", "description"],
      include: {
        model: db.Role,
        attributes: ["id", "url", "description"],
        through: { attributes: [] },
      },
    });
    return {
      EM: "Get role by group succeeds",
      EC: 0,
      DT: roles,
    };
  } catch (error) {
    return {
      EM: "Some things is wrong",
      EC: "-1",
      DT: [],
    };
  }
};
const assignRoleToGroup = async (data) => {
  try {
    await db.Group_Role.destroy({
      where: { groupId: +data.groupId },
    });
    await db.Group_Role.bulkCreate(data.groupRoles);
    return {
      EM: "Assign role to group success",
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

module.exports = {
  createRole,
  getListRole,
  deleteRole,
  getRoleById,
  updateRole,
  getRoleByGroup,
  assignRoleToGroup,
};
