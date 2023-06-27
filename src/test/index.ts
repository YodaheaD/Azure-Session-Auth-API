import express, { Request, Response, Router } from "express";
import { AuthTable, AuthTableProps } from "../db/auth";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import Logger from "../../utils/logger";

export const testRouter: Router = Router();
testRouter.use(cookieParser());

// Testingtest Cookies
testRouter.use(
  session({
    secret: "keyboardcat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

testRouter.use(express.json());
//testRouter.use(express.urlencoded({ extended: true }));
testRouter.use(cors());
//serving public file
//testRouter.use(express.static(__dirname));
testRouter.use(cookieParser());

///////////////////////
/** 
testRouter.use(function(req, res, next) {
  if (session.userid==) {//!req.headers.authorization
    return res.status(403).json({ error: 'No credentials sent!' });
  }
  next();
});
*/
testRouter.get("/", (req, res) => {
  Logger.info("Hello from test route");
  res.send("Hello from test route");
});

testRouter.post("/userData", async (req: Request, res: Response) => {
  const { username,password,token } = req.body;
  const data:any =JSON.stringify(await AuthTable.updateToken(username,password,token))
  Logger.info(`\n${data}`)
  res.send(` ${data}`);
 
   
});

testRouter.get("/getSession", (req, res) => {
  res.send(`The Cookie data: ${JSON.stringify(
    req.cookies
  )}\n\n\n The Session data: ${JSON.stringify(req.session)}
  \n\n\n The Session ID: ${JSON.stringify(
    req.sessionID
  )} \n\n\n The Session Cookie: ${JSON.stringify(req.session.cookie)} 
  \n\n\n The Session Headers: ${JSON.stringify(req.headers)}`);
});

interface AuthResponseProps {
  message: string;
  dbToken?: string;
}
//Testing Azure Table username and password recognition
testRouter.post("/user", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  //res.send( JSON.stringify(await AuthTable.checkUserPassword(username, password)));
  //const message = await  JSON.stringify(await AuthTable.provideToken(username, password) );
  //res.send(message);

  const { message, dbToken }: AuthResponseProps = await AuthTable.provideToken(
    username,
    password
  );
  //res.send(message);

  switch (message) {
    case "WrongPassword":
      res.status(401).send("Wrong Password or Username.");
      break;
    case "User not found":
      res.status(400).send("Username not found.");
      break;
    case "Success":
      res.status(200).send(dbToken);
      break;
    case "undefined":
      res.status(204).send("Autherized user but no token found.");

    default:
      res.status(404).send("General Error");
      break;
  }
});
