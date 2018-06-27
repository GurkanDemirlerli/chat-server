import mongoose = require("mongoose");

export interface IMessage extends mongoose.Document {
    content: string;
    from: string;
    to: string;
    createdAt: Date;
}