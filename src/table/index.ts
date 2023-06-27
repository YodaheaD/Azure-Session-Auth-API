import { Request, Response, Router } from "express";
import { UsersTable,UsersTableInt } from "../db/users";
import sessions from "express-session";


export const tablerouter:Router = Router();
import { TableClient, TableServiceClient } from "@azure/data-tables";
import { AuthTable } from "../db/auth";
import Logger from "../../utils/logger";
import { app } from "../..";


/**
 * Routes List
 * ______________________
 *  -> '/Test'
 * This route will post a 'dummy' entry to make sure the table is setup correctly.
 * 
 *  -> '/Post'
 * This route takes a request body and inserts it into an Azure Table. 
 * 
 *  -> '/Get'
 * This route gets ALL the entries (data) in the Azure table and returns the data in a 
 * --- json array. The array needs to be destructured on client side.
 * 
 *  *  -> '/Delete'
 * This route takes an id from the request body and deletes entry at id in
 * --- an Azure Table. 
 */


 // Variables
 let idData: any[]=[]
let nameData:any[]=[]
//
var session;
const oneDay = 1000 * 60 * 60 * 24;
/**
tablerouter.use(sessions({
  secret: "secret",
  saveUninitialized:true,
  cookie: { maxAge: oneDay },
  resave: false
}));
 */

tablerouter.get("/Test",async (req:Request,res:Response) => {
//Route for testing table
   const userFormat: UsersTableInt = {
    partitionKey: "PKeyTest",
    rowKey: "RKeyTest",
    name: "NameTest",
    id:0,
  };
  //Inserting test data
  await UsersTable.insertEntity(userFormat);
    res.json("Inserted data ")
})

tablerouter.post("/Post", async  (req:Request,res:Response) => {

    // Unpack the object "" which has the following properties:
    //  PartitionKey, rowKey, name, and id
    const {data}= req.body
    
   // Assign incoming data to 'userFormat' to ensure request body type
   // - matches that of our Azure table.
   const userFormat: UsersTableInt = {
    partitionKey: "PKey-"+data.id,
    rowKey: "RKey-"+data.id,
    name:data.name,
    id: data.id,
  };
  
  // Inserting the data in correct format to the Table
  await UsersTable.insertEntity(userFormat);
  res.json(`Inserted data: ${ JSON.stringify(userFormat)}`)

    
})

tablerouter.get("/Get",async (req:Request,res:Response) => {
  

let sessionUsername =  req.app.get('ClientUserID');
let DBSessionToken:any= await AuthTable.provideTokenNoAuth(sessionUsername);
Logger.info(`The Token from DB: ${DBSessionToken.dbToken}
The Token from Session Exp Variable: ${app.get("ClientUserSessionID")}
The Current Req's Session ID: ${req.sessionID}`)//${req.sessionID}
  //if (session.userid) {
    // - Successful login code
    // Entites object contains two arrays: 'idData' and 'nameData'
if( DBSessionToken.dbToken==app.get('ClientUserSessionID')){
  Logger.http(`\n -> Authentication User ${sessionUsername} accessing table: `)
   // console.log(`The Sessions data: ${JSON.stringify(sessionUsername)}\n\n`)
    const entities = await UsersTable.myGetDataUsers();
    // - Return 'entities' object.
    res.json((entities));
}else{
  Logger.warn(`\n -> A User failed to access table. `)
res.json("Authentication failed")
}


 
  })


  // -> This route recieves a id in request body and deletes entry at id. 
  tablerouter.delete("/Delete",async (req:Request,res:Response) => {
  
    const {number} = req.body//console.log(String(number))
    await UsersTable.myDeleteData(number)
    Logger.info(`\n -> Deleted at ${number}`)
    res.json(`Deleted at ${number}`)
    })