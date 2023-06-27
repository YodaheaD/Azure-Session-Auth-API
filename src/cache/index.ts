import e, { Router } from "express";
import expeditious from "express-expeditious";
import * as express from "express";
import { UsersTable } from "../db/users";
import * as fs from "fs";
import * as path from "path";
import { AuthTable } from "../db/auth";
import { app } from "../..";

const cacheoptions: expeditious.ExpeditiousOptions = {
  namespace: "expresscache",
  defaultTtl: "1 minute",
};

const cache = expeditious(cacheoptions);

export const CacheRouter: Router = Router();

// -> The initial call to this will take 2 seconds, but any subsequent calls
// will receive a response instantly from cache for the time designated in .withTtl()
CacheRouter.get("/testUsers", cache.withTtl("1 minute"), async (req, res) => {
  const entities = await UsersTable.myGetDataUsers();
  //res.json(entities)
  setTimeout(() => {
    res.send(entities);
    //res.end('pong');
  }, 2000);
});


// The 'testAuth' route is NOT cached, but protected via Auth.
CacheRouter.get("/testAuth", async (req, res) => {

    let sessionUsername = req.app.get("ClientUserID");
  let DBSessionToken: any = await AuthTable.provideTokenNoAuth(sessionUsername);

if( DBSessionToken.dbToken==app.get('ClientUserSessionID')){
  const entities = await AuthTable.myGetDataAuth();
      res.send(entities);
 }else{
    res.send("You are not logged in")
}
});


