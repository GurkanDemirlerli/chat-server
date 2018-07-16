import DataAccess = require('../Connection');
import { Schema } from 'mongoose';
import { IUser } from '../../models';
// import { EmailValidators, UserNameValidators, PasswordValidators } from './Validators/UserValidator';
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class UserSchema {

    static get schema() {
        var schema = new Schema({
            email: {
                type: String,
                required: true,
                unique: true,
            },
            username: {
                type: String,
                required: true,
            },
            firstname: {
                type: String,
                required: true,
            },
            lastname: {
                type: String,
                required: true
            },
            password: {
                type: String,
                required: true,
            },
            about: {
                type: String,
                default: "Hello i am using Chat-App!"
            },
            notificationId: {
                type: String,
                default: ""
            },
            createdAt: {
                type: Date,
                default: Date.now()
            }
        });

        // schema.virtual('friendshipsByRequested', {
        //     ref: 'FriendShip',
        //     localField: '_id',
        //     foreignField: 'sender'
        // });

        // schema.virtual('friendshipsByAccepted', {
        //     ref: 'FriendShip',
        //     localField: '_id',
        //     foreignField: 'acceptor'
        // });

        // schema.virtual('friends').get(function () {
        //     let friendsA = this.friendshipsByRequested.map((r) => {
        //         return 
        //     })

        //     let friendsB = this.friendshipsByAccepted.map((r) => {

        //     })
        // });
        return schema;
    }


}
var schema = mongooseConnection.model<IUser>('User', UserSchema.schema);
export = schema;

//TODO
//1-    Emailde Unique saglanmiyor. düzelt.

//Kenarda Dursun

// projectSchema.virtual('owner', {
//     ref: 'People',
//     localField: '_id',
//     foreignField: 'owns',
//     justOne: true // Only return one owner
//   });