import { IUser } from './../../';
import mongoose = require("mongoose");

export interface ILocalNotification extends mongoose.Document {
    contentType: number;
    from?: string | IUser;
    to: string | IUser;
    createdAt?: Date;
    isRead?: Boolean;
}