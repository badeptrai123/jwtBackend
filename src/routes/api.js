import express from "express";
import apiController from "../controllers/apiController";
import userController from "../controllers/userController";
import groupController from "../controllers/groupController";
import roleController from "../controllers/roleController";
import { checkUserJWT, checkUserPermission } from "../middleware/JWTAction";
const route = express.Router();
const initApiRoute = (app) => {
  route.all("*", checkUserJWT, checkUserPermission);
  route.post("/register", apiController.handleRegister);
  route.post("/login", apiController.handleLogin);
  route.post("/logout", apiController.handleLogout);

  route.get("/user/read", userController.handleReadUser);
  route.post("/user/create", userController.handleCreateUser);
  route.put("/user/update", userController.handleUpdateUser);
  route.delete("/user/delete", userController.handleDeleteUser);

  route.get("/role/read", roleController.handleReadRole);
  route.post("/role/create", roleController.handleCreateRole);
  route.put("/role/update", roleController.handleUpdateRole);
  route.delete("/role/delete", roleController.handleDeleteRole);
  route.get("/role/by-group/:groupId", roleController.handleGetRoleByGroup);
  route.post("/role/assign-to-group", roleController.handleAssignRoleToGroup);

  route.get("/account", userController.getUserAccount);
  route.get("/group/read", groupController.readGroup);

  return app.use("/api/v1/", route);
};
export default initApiRoute;
