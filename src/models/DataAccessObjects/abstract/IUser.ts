import mongoose = require("mongoose");
import { IFriendShip } from '../..';

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    about: string;
    password: string;
    notificationId?: string;
    createdAt: Date;
    SendedFriendShips: IFriendShip[];
    AcceptedFriendShips: IFriendShip[];
}