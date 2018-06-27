import mongoose = require("mongoose");

export interface ITask extends mongoose.Document {
    content: string;
    owner: string;
}