import { IMessage } from './IMessage';
import { IUser } from './IUser';
import mongoose = require("mongoose");

export interface IFriendRequest extends mongoose.Document {
    sender: string | IUser;
    receiver: string | IUser;
    createdAt?: Date;
    requestMessage?: string;
    //0 beklemede
    //1 kabul
    //2 ret
    //3 iptal
    //daha sonra enum yapılacaktır.
    status?: number;
}