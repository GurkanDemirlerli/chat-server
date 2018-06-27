import mongoose = require("mongoose");

export interface IFriendShip extends mongoose.Document {
    sender: string;
    acceptor: string;
    createdAt?: Date;
}