import { IUser } from './IUser';
import mongoose = require("mongoose");

export interface IFriendShip extends mongoose.Document {
    sender: string | IUser;
    acceptor: string | IUser;
    createdAt?: Date;
}