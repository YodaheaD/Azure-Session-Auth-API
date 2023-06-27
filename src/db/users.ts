import { myTableLike } from "./mytablelike";

export interface UsersTableInt{
    partitionKey:string
    rowKey:string
    name:string
    id:number
}

export const UsersTable = new myTableLike<UsersTableInt>("users")