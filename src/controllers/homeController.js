import userService from "../services/userService";
const handleHelloWorld = (req, res) => {
  return res.render("home.ejs");
};
const handleUserPage = async (req, res) => {
  const userList = await userService.getListUser();
  return res.render("user.ejs", { userList });
};
const handleCreateUser = async (req, res) => {
  const { email, password, username } = req.body;
  await userService.createUser(email, password, username);
  return res.redirect("/user");
};
const handleDeleteUser = async (req, res) => {
  const { id } = req.params;
  await userService.deleteUser(id);
  return res.redirect("/user");
};
const getUpdateUserPage = async (req, res) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  let userData = {};
  userData = user;
  return res.render("update-user.ejs", { userData });
};
const handleUpdateUser = async (req, res) => {
  const { id, email, username } = req.body;
  await userService.updateUser(id, email, username);
  return res.redirect("/user");
};
module.exports = {
  handleHelloWorld,
  handleUserPage,
  handleCreateUser,
  handleDeleteUser,
  getUpdateUserPage,
  handleUpdateUser,
};
