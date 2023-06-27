import { TableClient, TableEntity, TableTransaction } from "@azure/data-tables";

import { isEmpty } from "lodash";
import next from "next/types";
import Logger from "../../utils/logger";

const connectionString = "UseDevelopmentStorage=true";

export class myTableLike<Type extends TableEntity<object>> {
  private client?: TableClient;

  constructor(public readonly tableName: string) {
    this.client = TableClient.fromConnectionString(connectionString, tableName);
    this.createTable();
  }

  /**
   * Functions List
   * ______________________
   *  -> 'catcher()'
   * Error catcher function
   *
   *  -> 'createTable()' & 'insertEntity()' & 'listEntities()'
   * Functions to create, add to, and list table. 

   * -> 'myGetDataAuth()' & 'myGetDataUsers()'
   * Function for getting all the entries (data) from Azure Table.
   * 
   * -> 'getSingleData()'
   * Function for getting single data entries from Azure Table.
   *
   * -> 'myDeleteData()'
   * Function for deleting entries at specific id in Azure Table.
   * 
   * -> 'myUpdateData()'
   * Function for updating entries at specific id in Azure Table.
   * -> 'provideToken()' and 'provideTokenNoAuth()'
   * Function to verify username and password then provide saved token data.
   * 
   * -> 'updateToken()' and 'updateTokenNoAuth()'
   * Function to update token data.   
   *  
   * -> 'checkUserPassword()'
   * Checks if the password entered by the user matches the password in the database.
   * 
   * -> 'checkUserExists()'
   * Function that checks if username exists already.
   */

  // -> Error catcher function
  private catcher(err: any) {
    if (err.statusCode !== 409) {
      throw err;
    }
  }
  // -> Function to create the table
  public async createTable() {
    await this.client?.createTable().catch(this.catcher);
  }

  // Function to add entity to table
  public async insertEntity(entity: Type) {
    await this.client?.createEntity(entity).catch(this.catcher); //
  }

  //  Function to List entities (not functional yet, use myGetData())
  public listEntities() {
    return this.client?.listEntities<Type>();
  }

  // 'myGetDataAuth()
  // -> Function for getting all the entries (data) from Azure Table.
  public async myGetDataAuth() {
    let usernameData: any[] = [];
    let nameData: any[] = [];
    const client = TableClient.fromConnectionString(
      connectionString,
      this.tableName
    );
    // Getting all data from the table
    const entities = await client.listEntities();
    // Pushing entity data into an Array
    console.log("\n Serving Data.... ");
    for await (const entity of entities) {
      console.log(` * Id: ${entity.username}, Password: ${entity.password} `);
      usernameData.push(entity.username);
      nameData.push(entity.password);
    }
    return [{ usernameData, nameData }];
  }
  // -> 'myGetDataUsers()'
  // * Function for getting User table data from Azure Table.
  public async myGetDataUsers() {
    let nameData: any[] = [];
    let idData: any[] = [];
    const client = TableClient.fromConnectionString(
      connectionString,
      this.tableName
    );
    // Getting all data from the table
    const entities = await client.listEntities();

    // Pushing entity data into there respective Arrays
    console.log("\n Serving Data.... ");

    for await (const entity of entities) {
      console.log(` * Id: ${entity.name}, Password: ${entity.id} `);
      nameData.push(entity.name);
      idData.push(entity.id);
    }
    // Returning the data in a JSON array format
    return [{ nameData, idData }];
  }

  // -> 'getSingleData()'
  // * Function for getting single data entries from Azure Table.
  public async GetSingleData(username: string) {
    const entity: any = await this.client?.getEntity(
      "PKey-" + username,
      "RKey-" + username
    );
    const currentUsername = entity.username;
    const currentPassword = entity.password;
    const TableToken = entity.token;

    return entity;
  }

  // -> 'myDeleteData()'
  // Function for deleting entries at specific id in Azure Table.
  public async myDeleteData(deleteid: string) {
    await this.client?.deleteEntity(`PKey-${deleteid}`, `RKey-${deleteid}`);
  }

  // -> 'checkUserExists()'
  // Function that accepts RKey and PKey to check if entry exists at position.
  public async checkUserExists(username: string) {
    let ErrorMessage = "ERROR -> Not found";
    let Checker = false;
    try {
      const entity: any = await this.client?.getEntity(
        "PKey-" + username,
        "RKey-" + username
      );
      Checker = true;
      return Checker;
    } catch (error) {
      return false;
    }
  }

  // -> 'checkUserPassword()'
  //-> Check if user and password match, returns true if they do.
  public async checkUserPassword(username: string, password: string) {
    let usernameData: any[] = [];
    let passwordData: any[] = [];
    const client = TableClient.fromConnectionString(
      connectionString,
      this.tableName
    );
    let userCheck = false;
    let passwCheck = false;

    const entities = await client.listEntities();
    // Pushing entity data into an Array

    for await (const entity of entities) {
      usernameData.push(entity.username);
      passwordData.push(entity.password);
    }

    // Use .find method to check if username exists in the array
    if (usernameData.find((element) => element === username)) {
      userCheck = true;
    } else {
      userCheck = false;
    }

    // Use the now verified Username to get the password from the table
    // -- and compared it to user's input password. If they match --> verified.
    const entity: any = await this?.GetSingleData(username);
    //Logger.info("Entity: "+JSON.stringify(entity))

    if (entity.password === password) {
      Logger.info("Password Matched");
      passwCheck = true;
    } else {
      passwCheck = false;
    }

    // Final check to see if both username and password are verified.
    const FinalDesc = userCheck && passwCheck; //Logger.warn(`UserCheck: ${userCheck} PasswCheck: ${passwCheck} \n FinalDesc: ${FinalDesc}`)

    return FinalDesc; //return [{ (userCheck, passwCheck) }];
  }
  // -> 'provideToken()'
  //-> Function to verify username and password then provide saved token data.
  public async provideToken(username: string, password: string) {
    let ErrorMessage = "ERROR -> Not found";
    try {
      const entity: any = await this.client?.getEntity(
        "PKey-" + username,
        "RKey-" + username
      );
      let dbPassword = entity.password;
      let dbToken = entity.token;

      if (password === dbPassword) {
        // return `The username :${entity.username}\n\nThe password :${entity.password}\n\nThe token :${entity.token}`;
        let message = "Success";
        return { dbToken, message };
      } else {
        let message = "WrongPassword";
        return { message };
      }
    } catch (error) {
      let message = "User not found";
      return { message };
    }
  }
  // -> 'provideTokenNoAuth()'
  // Function for providing token With no authentication, used internally only.
  public async provideTokenNoAuth(username: string) {
    let ErrorMessage = "ERROR -> Not found";
    try {
      const entity: any = await this.client?.getEntity(
        "PKey-" + username,
        "RKey-" + username
      );
      let dbPassword = entity.password;
      let dbToken = entity.token;

      if (entity) {
        // return `The username :${entity.username}\n\nThe password :${entity.password}\n\nThe token :${entity.token}`;
        let message = "Success";
        return { dbToken, message };
      }
    } catch (error) {
      let message = "User not found";
      return { message };
    }
  }

  // -> 'updateToken()'
  // Function to update token data
  public async updateToken(
    usernameInput: string,
    passwordInput: string,
    NewToken: string
  ) {
    if (
      (await this.checkUserPassword(usernameInput, passwordInput)) === false
    ) {
      return "Auth Failed";
    }
    // Define the entity to update
    const partitionKey = "PKey-" + usernameInput;
    const rowKey = "RKey-" + usernameInput;
    try {
      const entityToUpdate = {
        partitionKey: partitionKey,
        rowKey: rowKey,
        token: NewToken, // Replace with the current value of the property
      };
      await this.client?.updateEntity(entityToUpdate);
    } catch (error) {
      Logger.error("Error updating token to DB");
      return "Error updating token to DB";
    }
    const { username, token }: any = await this.client?.getEntity(
      partitionKey,
      rowKey
    );
    //Logger.info(`Success -> ${username}'s Token updated: ${token}`);
    return `Successful Update for ${username}'s Token: ${token}`;
  }
  // -> 'updateTokenNoAuth()'
  // Function to update token data for deletion route. No authentication required.
  public async updateTokenNoAuth(usernameInput: string, NewToken: string) {
    // Define the entity to update
    const partitionKey = "PKey-" + usernameInput;
    const rowKey = "RKey-" + usernameInput;
    try {
      const entityToUpdate = {
        partitionKey: partitionKey,
        rowKey: rowKey,
        token: NewToken, // Replace with the current value of the property
      };
      await this.client?.updateEntity(entityToUpdate);
    } catch (error) {
      Logger.error("Error updating token to DB");
      return "Error updating token to DB";
    }
    const { username, token }: any = await this.client?.getEntity(
      partitionKey,
      rowKey
    );
    //Logger.info(`Success -> ${username}'s Token updated: ${token}`);
    return `Successful Update for ${username}'s Token: ${token}`;
  }
}
