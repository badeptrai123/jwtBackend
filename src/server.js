import express from "express";
import initWebRoute from "./routes/web";
import configViewEngine from "./config/viewEngine";
import bodyParser from "body-parser";
import connection from "./config/connectDB";
import initApiRoute from "./routes/api";
import configCors from "./config/cors";
import cors from "cors";
import cookieParser from "cookie-parser";

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;
const corsOptions = {
  origin: true, //included origin as true
  credentials: true, //included credentials as true
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config cookie parser
app.use(cookieParser());

configCors(app);
configViewEngine(app);

initWebRoute(app);
initApiRoute(app);

connection();

app.listen(PORT, () => {
  console.log("jwtBackend is running at port = " + PORT);
});
