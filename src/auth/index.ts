import express, { Response, Request, Router } from "express";
import sessions from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AuthTable, AuthTableProps } from "../db/auth";
import { v4 as uuidv4 } from "uuid";
import { app } from "../..";
import Logger from "../../utils/logger";

export const authRouter: Router = Router();

/**
 * Routes List
 * ______________________
 * -> '/register'
 *  This route is for registering a user to the Azure table.
 *
 * -> '/login'
 * This route is for logging in a user who exists in the Azure table.
 *
 * -> '/logout'
 * This route is for logging out a user who is currently logged in.
 *
 * Test Routes
 * ______________________
 * -> '/SESSION-DATA'
 * This route is for testing the session data.
 *
 * -> '/test'
 * Empty route for testing.
 *
 */

authRouter.use(express.json());
authRouter.use(cors());
authRouter.use(cookieParser());

var session;

//session middleware
const oneDay = 1000 * 60 * 60 * 24;
const tenSeconds = 1000 * 10;
authRouter.use(
  sessions({
    secret: "secret",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

// -> Registering a user
authRouter.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if(await AuthTable.checkUserExists(username) === false){
  const userFormat: AuthTableProps = {
    partitionKey: "PKey-" + username,
    rowKey: "RKey-" + username,
    username: username,
    password: password,
    token: "Default-"+uuidv4(),
  };
  await AuthTable.insertEntity(userFormat);

  Logger.info(`\n -> Username: ${userFormat.username} \n -> Token: ${userFormat.token} \n ***** New User Registered Successfully *****`)
  res.send("Data inserted\n ->" + JSON.stringify(userFormat));
}else{
  res.send("Username already exists. Try a different one.")
  Logger.warn("\n -> Username already exists. Try a different one.")
}
});

// -> Login
authRouter.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (await AuthTable.checkUserPassword(username, password) === true) {
    // Get the sessionID and Session and store it in Exp Varaible
    session = req.session;
    session.userSessionID=req.sessionID
    session.userid = req.body.username;
    app.set("ClientUserID", session.userid);
    app.set("ClientUserSessionID", req.sessionID);
    app.set("ClientFullSession", session);
    // Get current Session ID stored in Table
    const data: any = await AuthTable.provideToken(username, password);
    Logger.info(
      `\n -> Current Client User ID: ${JSON.stringify(
        app.get("ClientUserID")
      )} \n -> Current Client Session ID: ${JSON.stringify(
        app.get("ClientUserSessionID")
      )} \n -> Old DB session ID: ${JSON.stringify(data)}`
    );
    const message: any = await AuthTable.updateToken(
      username,
      password,//
      app.get("ClientUserSessionID")
    );
    Logger.info(
      `\n -> ${message} \n\n ***** User Authenticated Successfully *****`
    );
    res.status(200).json({
      message: "User Authenticated Successfully",
    });
  } else {
    res.status(400).json({
      message: "Invalid username or password",
    });
  }
});
// -> Logout

authRouter.get("/logout", async (req: Request, res: Response) => {
  // Destroy session
  req.session.destroy;
  const currUser = req.app.get("ClientUserID");
  // Change exp variable to logged out
  app.set("ClientUserID", "LoggedOut");
  console.log(
    `User ${currUser}: ${JSON.stringify(req.app.get("ClientUserID"))}`
  );
  //Update the session ID in the table
  const message: any = await AuthTable.updateTokenNoAuth(currUser, "LoggedOut");

  Logger.warn(`-> Logout Successful for ${currUser}`);

  // Redirect user
  res.send(
    `The user ${currUser} has been logged out.`
  );
});


// -> Return
authRouter.get("/return", async (req: Request, res: Response) => {
  res.send(
    `The user ${JSON.stringify(
      req.app.get("ClientUserID")
    )} has been logged out.`
  );
}
);