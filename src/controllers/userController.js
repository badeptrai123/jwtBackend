import userApiService from "../services/userApiService";

const handleReadUser = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      const page = req.query.page;
      const limit = req.query.limit;
      let data = await userApiService.getListUserWithPagination(+page, +limit);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    } else {
      let data = await userApiService.getListUser();
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const handleCreateUser = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password || !req.body.phone) {
      return res.status(200).json({
        EM: "Missing required parameters",
        EC: "1",
        DT: "",
      });
    }
    if (req.body.password && req.body.password.length < 6) {
      return res.status(200).json({
        EM: "Password has a minimum of 6 characters",
        EC: "1",
        DT: "",
      });
    }
    let data = await userApiService.createUser(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const handleUpdateUser = async (req, res) => {
  try {
    let data = await userApiService.updateUser(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const handleDeleteUser = async (req, res) => {
  try {
    let data = await userApiService.deleteUser(req.body.id);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    return res.status(500).json({
      EM: "error from server",
      EC: "-1",
      DT: "",
    });
  }
};
const getUserAccount = (req, res) => {
  return res.status(200).json({
    EM: "OK",
    EC: 0,
    DT: {
      access_token: req.token,
      groupWithRoles: req.user.groupWithRoles,
      email: req.user.email,
      username: req.user.username,
    },
  });
};
module.exports = {
  handleReadUser,
  handleCreateUser,
  handleUpdateUser,
  handleDeleteUser,
  getUserAccount,
};
