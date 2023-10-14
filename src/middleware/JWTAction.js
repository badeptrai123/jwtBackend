import jwt from "jsonwebtoken";
require("dotenv").config();

let nonSecurePaths = ["/", "/register", "/login", "/logout"];

const createJWT = (payload) => {
  let key = process.env.JWT_SECRET;
  let token = null;
  try {
    token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPIRES_IN });
    console.log(token);
  } catch (error) {
    console.log(error);
  }
  return token;
};

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const verifyToken = (token) => {
  let key = process.env.JWT_SECRET;
  let decoded = null;
  try {
    decoded = jwt.verify(token, key);
  } catch (error) {
    console.log(error);
  }
  return decoded;
};
const checkUserJWT = (req, res, next) => {
  try {
    if (nonSecurePaths.includes(req.path)) {
      return next();
    }
    let cookies = req.cookies;
    let tokenFromHeader = extractToken(req);

    if ((cookies && cookies.jwt) || tokenFromHeader) {
      let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;
      let decoded = verifyToken(token);
      if (decoded) {
        req.user = decoded;
        req.token = token;
        next();
      } else {
        return res.status(401).json({
          EC: 1,
          DT: "",
          EM: "Not authenticated the user",
        });
      }
    } else {
      return res.status(401).json({
        EC: 1,
        DT: "",
        EM: "Not authenticated the user",
      });
    }
  } catch (error) {}
};
const checkUserPermission = (req, res, next) => {
  try {
    if (nonSecurePaths.includes(req.path) || req.path === "/account") {
      return next();
    }
    if (req.user) {
      // const email = req.user.email;
      const roles = req.user.groupWithRoles.Roles;
      const currentPath = req.path;

      let canAccess = roles.some(
        (role) => role.url === currentPath || currentPath.includes(role.url)
      );

      if (!roles || roles.length == 0) {
        return res.status(403).json({
          EC: -1,
          DT: "",
          EM: "you don't have permission to access this resource...",
        });
      } else {
        if (canAccess) {
          next();
        } else {
          return res.status(403).json({
            EC: 1,
            DT: "",
            EM: "you don't have permission to access this resource...",
          });
        }
      }
    } else {
      return res.status(401).json({
        EC: 1,
        DT: "",
        EM: "Not authenticated the user",
      });
    }
  } catch (error) {}
};
module.exports = {
  createJWT,
  verifyToken,
  checkUserJWT,
  checkUserPermission,
};
