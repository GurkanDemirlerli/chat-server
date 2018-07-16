import mongoose = require("mongoose");
import { IFriendShip } from '../..';

export interface IUser extends mongoose.Document {
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    about: string;
    password: string;
    notificationId?: string;
    createdAt: Date;
    SendedFriendShips: IFriendShip[];
    AcceptedFriendShips: IFriendShip[];
}