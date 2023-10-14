import express from "express";
import homeController from "../controllers/homeController";

const route = express.Router();
const initWebRoute = (app) => {
  route.get("/", homeController.handleHelloWorld);
  route.get("/user", homeController.handleUserPage);
  route.post("/users/create-user", homeController.handleCreateUser);
  route.post("/delete-user/:id", homeController.handleDeleteUser);
  route.get("/edit-user/:id", homeController.getUpdateUserPage);
  route.post("/update-user", homeController.handleUpdateUser);
  return app.use("/", route);
};
export default initWebRoute;
