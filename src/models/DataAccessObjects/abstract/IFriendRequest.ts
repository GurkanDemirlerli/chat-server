import mongoose = require("mongoose");

export interface IFriendRequest extends mongoose.Document {
    sender: string;
    receiver: string;
    requestTime?: Date;
    requestMessage?: string;
    //0 beklemede
    //1 kabul
    //2 ret
    //daha sonra enum yapılacaktır.
    status?: Number;
}