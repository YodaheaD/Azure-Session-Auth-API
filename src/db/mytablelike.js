"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myTableLike = void 0;
const data_tables_1 = require("@azure/data-tables");
const logger_1 = __importDefault(require("../../utils/logger"));
const connectionString = "UseDevelopmentStorage=true";
class myTableLike {
    constructor(tableName) {
        this.tableName = tableName;
        this.client = data_tables_1.TableClient.fromConnectionString(connectionString, tableName);
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
    catcher(err) {
        if (err.statusCode !== 409) {
            throw err;
        }
    }
    // -> Function to create the table
    createTable() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.client) === null || _a === void 0 ? void 0 : _a.createTable().catch(this.catcher));
        });
    }
    // Function to add entity to table
    insertEntity(entity) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.client) === null || _a === void 0 ? void 0 : _a.createEntity(entity).catch(this.catcher)); //
        });
    }
    //  Function to List entities (not functional yet, use myGetData())
    listEntities() {
        var _a;
        return (_a = this.client) === null || _a === void 0 ? void 0 : _a.listEntities();
    }
    // 'myGetDataAuth()
    // -> Function for getting all the entries (data) from Azure Table.
    myGetDataAuth() {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let usernameData = [];
            let nameData = [];
            const client = data_tables_1.TableClient.fromConnectionString(connectionString, this.tableName);
            // Getting all data from the table
            const entities = yield client.listEntities();
            // Pushing entity data into an Array
            console.log("\n Serving Data.... ");
            try {
                for (var _d = true, entities_1 = __asyncValues(entities), entities_1_1; entities_1_1 = yield entities_1.next(), _a = entities_1_1.done, !_a; _d = true) {
                    _c = entities_1_1.value;
                    _d = false;
                    const entity = _c;
                    console.log(` * Id: ${entity.username}, Password: ${entity.password} `);
                    usernameData.push(entity.username);
                    nameData.push(entity.password);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = entities_1.return)) yield _b.call(entities_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return [{ usernameData, nameData }];
        });
    }
    // -> 'myGetDataUsers()'
    // * Function for getting User table data from Azure Table.
    myGetDataUsers() {
        var _a, e_2, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let nameData = [];
            let idData = [];
            const client = data_tables_1.TableClient.fromConnectionString(connectionString, this.tableName);
            // Getting all data from the table
            const entities = yield client.listEntities();
            // Pushing entity data into there respective Arrays
            console.log("\n Serving Data.... ");
            try {
                for (var _d = true, entities_2 = __asyncValues(entities), entities_2_1; entities_2_1 = yield entities_2.next(), _a = entities_2_1.done, !_a; _d = true) {
                    _c = entities_2_1.value;
                    _d = false;
                    const entity = _c;
                    console.log(` * Id: ${entity.name}, Password: ${entity.id} `);
                    nameData.push(entity.name);
                    idData.push(entity.id);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = entities_2.return)) yield _b.call(entities_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            // Returning the data in a JSON array format
            return [{ nameData, idData }];
        });
    }
    // -> 'getSingleData()'
    // * Function for getting single data entries from Azure Table.
    GetSingleData(username) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const entity = yield ((_a = this.client) === null || _a === void 0 ? void 0 : _a.getEntity("PKey-" + username, "RKey-" + username));
            const currentUsername = entity.username;
            const currentPassword = entity.password;
            const TableToken = entity.token;
            return entity;
        });
    }
    // -> 'myDeleteData()'
    // Function for deleting entries at specific id in Azure Table.
    myDeleteData(deleteid) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.client) === null || _a === void 0 ? void 0 : _a.deleteEntity(`PKey-${deleteid}`, `RKey-${deleteid}`));
        });
    }
    // -> 'checkUserExists()'
    // Function that accepts RKey and PKey to check if entry exists at position.
    checkUserExists(username) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let ErrorMessage = "ERROR -> Not found";
            let Checker = false;
            try {
                const entity = yield ((_a = this.client) === null || _a === void 0 ? void 0 : _a.getEntity("PKey-" + username, "RKey-" + username));
                Checker = true;
                return Checker;
            }
            catch (error) {
                return false;
            }
        });
    }
    // -> 'checkUserPassword()'
    //-> Check if user and password match, returns true if they do.
    checkUserPassword(username, password) {
        var _a, e_3, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let usernameData = [];
            let passwordData = [];
            const client = data_tables_1.TableClient.fromConnectionString(connectionString, this.tableName);
            let userCheck = false;
            let passwCheck = false;
            const entities = yield client.listEntities();
            try {
                // Pushing entity data into an Array
                for (var _d = true, entities_3 = __asyncValues(entities), entities_3_1; entities_3_1 = yield entities_3.next(), _a = entities_3_1.done, !_a; _d = true) {
                    _c = entities_3_1.value;
                    _d = false;
                    const entity = _c;
                    usernameData.push(entity.username);
                    passwordData.push(entity.password);
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = entities_3.return)) yield _b.call(entities_3);
                }
                finally { if (e_3) throw e_3.error; }
            }
            // Use .find method to check if username exists in the array
            if (usernameData.find((element) => element === username)) {
                userCheck = true;
            }
            else {
                userCheck = false;
            }
            // Use the now verified Username to get the password from the table
            // -- and compared it to user's input password. If they match --> verified.
            const entity = yield (this === null || this === void 0 ? void 0 : this.GetSingleData(username));
            //Logger.info("Entity: "+JSON.stringify(entity))
            if (entity.password === password) {
                logger_1.default.info("Password Matched");
                passwCheck = true;
            }
            else {
                passwCheck = false;
            }
            // Final check to see if both username and password are verified.
            const FinalDesc = userCheck && passwCheck; //Logger.warn(`UserCheck: ${userCheck} PasswCheck: ${passwCheck} \n FinalDesc: ${FinalDesc}`)
            return FinalDesc; //return [{ (userCheck, passwCheck) }];
        });
    }
    // -> 'provideToken()'
    //-> Function to verify username and password then provide saved token data.
    provideToken(username, password) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let ErrorMessage = "ERROR -> Not found";
            try {
                const entity = yield ((_a = this.client) === null || _a === void 0 ? void 0 : _a.getEntity("PKey-" + username, "RKey-" + username));
                let dbPassword = entity.password;
                let dbToken = entity.token;
                if (password === dbPassword) {
                    // return `The username :${entity.username}\n\nThe password :${entity.password}\n\nThe token :${entity.token}`;
                    let message = "Success";
                    return { dbToken, message };
                }
                else {
                    let message = "WrongPassword";
                    return { message };
                }
            }
            catch (error) {
                let message = "User not found";
                return { message };
            }
        });
    }
    // -> 'provideTokenNoAuth()'
    // Function for providing token With no authentication, used internally only.
    provideTokenNoAuth(username) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let ErrorMessage = "ERROR -> Not found";
            try {
                const entity = yield ((_a = this.client) === null || _a === void 0 ? void 0 : _a.getEntity("PKey-" + username, "RKey-" + username));
                let dbPassword = entity.password;
                let dbToken = entity.token;
                if (entity) {
                    // return `The username :${entity.username}\n\nThe password :${entity.password}\n\nThe token :${entity.token}`;
                    let message = "Success";
                    return { dbToken, message };
                }
            }
            catch (error) {
                let message = "User not found";
                return { message };
            }
        });
    }
    // -> 'updateToken()'
    // Function to update token data
    updateToken(usernameInput, passwordInput, NewToken) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield this.checkUserPassword(usernameInput, passwordInput)) === false) {
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
                yield ((_a = this.client) === null || _a === void 0 ? void 0 : _a.updateEntity(entityToUpdate));
            }
            catch (error) {
                logger_1.default.error("Error updating token to DB");
                return "Error updating token to DB";
            }
            const { username, token } = yield ((_b = this.client) === null || _b === void 0 ? void 0 : _b.getEntity(partitionKey, rowKey));
            //Logger.info(`Success -> ${username}'s Token updated: ${token}`);
            return `Successful Update for ${username}'s Token: ${token}`;
        });
    }
    // -> 'updateTokenNoAuth()'
    // Function to update token data for deletion route. No authentication required.
    updateTokenNoAuth(usernameInput, NewToken) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            // Define the entity to update
            const partitionKey = "PKey-" + usernameInput;
            const rowKey = "RKey-" + usernameInput;
            try {
                const entityToUpdate = {
                    partitionKey: partitionKey,
                    rowKey: rowKey,
                    token: NewToken, // Replace with the current value of the property
                };
                yield ((_a = this.client) === null || _a === void 0 ? void 0 : _a.updateEntity(entityToUpdate));
            }
            catch (error) {
                logger_1.default.error("Error updating token to DB");
                return "Error updating token to DB";
            }
            const { username, token } = yield ((_b = this.client) === null || _b === void 0 ? void 0 : _b.getEntity(partitionKey, rowKey));
            //Logger.info(`Success -> ${username}'s Token updated: ${token}`);
            return `Successful Update for ${username}'s Token: ${token}`;
        });
    }
}
exports.myTableLike = myTableLike;
