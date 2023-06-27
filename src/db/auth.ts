import { myTableLike } from "./mytablelike"

export interface AuthTableProps{
    partitionKey:string
    rowKey:string
    username:string
    password:string
    token?:string
}

export const AuthTable = new myTableLike<AuthTableProps>("auth")