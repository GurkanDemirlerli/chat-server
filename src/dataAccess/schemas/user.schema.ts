import DataAccess = require('../Connection');
import { Schema } from 'mongoose';
import { IUser } from '../../models';
// import { EmailValidators, UserNameValidators, PasswordValidators } from './Validators/UserValidator';
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class UserSchema {

    static get schema() {
        var schema = new Schema({
            name: {
                type: String,
                required: true,
                minlength: 2,
                maxLength: 20
            },
            email: {
                type: String,
                required: true,
                unique: true,
                match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            },
            password: {
                type: String,
                required: true,
                match: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/
            },
            about: {
                type: String,
                default: ""
            },
            notificationId: {
                type: String,
                default: ""
            },
            SendedFriendShips: [{
                type: Schema.Types.ObjectId,
                ref: 'FriendShip'
            }],
            AcceptedFriendShips: [{
                type: Schema.Types.ObjectId,
                ref: 'FriendShip'
            }],
            createdAt: {
                type: Date,
                default: Date.now()
            }, tasks: [{
                type: Schema.Types.ObjectId,
                ref: 'Task'
            }],
        });
        schema.index({ name: 'text' });
        return schema;
    }


}
var schema = mongooseConnection.model<IUser>('User', UserSchema.schema);
export = schema;

//TODO
//1-    Emailde Unique saglanmiyor. düzelt.