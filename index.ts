import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import sessions, { SessionData } from "express-session";
import { tablerouter } from "./src/table";
import cors from "cors";
import { testRouter } from "./src/test";
import { authRouter } from "./src/auth";
import winston from "winston";
import expressWinston, { logger } from "express-winston";
import Logger from "./utils/logger";
import { CacheRouter } from "./src/cache";
import swaggerUi from "swagger-ui-express";
declare module "express-session" {
  export interface SessionData {
    userid: { [key: string]: any },
    userSessionID: any ,
  }
}

export const app = express();
//* Swagger Stuff
const swaggerData=require('./utils/swagger-output.json');

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerData));
// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(
  sessions({
    secret: "secret",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

// parsing the incoming data
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));
app.use(cors());
//serving public file
//app.use(express.static(__dirname));
app.use(cookieParser());
app.set("ClientUserSessionID","nullSessID")
app.use('/cache',CacheRouter)
app.use("/auth", authRouter);
app.use("/table", tablerouter);
app.use("/test", testRouter);

// a variable to save a session
export var session:SessionData;

app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: true, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req, res) {
      return false;
    }, // optional: allows to skip some log messages based on request and/or response
  })
);

/** */
app.get("/", (req: Request, res: Response) => {
 // session = req.session;
  if (session.userid) {
    res.send("Welcome User <a href='/logout'>click to logout</a>");
  }
  //res.send("Unautherized")
  else return res.status(401).send("Not Logged In"); //res.sendFile('views/index.html',{root:__dirname})
  //res.sendFile('views/index.html',{root:__dirname})
});

var test = 1;
app.get("/hello", function (req, res, next) {
  if (test == 1) {
    next();
    return;
  }
  res.send("Hello World !!!!");
});

app.get("/hello", function (req, res, next) {
  res.send("Hello Planet !!!!");
});

app.listen(3030, () =>
  //console.log
  Logger.http(`\n -> Server running on port 3031 `)
);
