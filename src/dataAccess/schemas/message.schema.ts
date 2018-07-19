import DataAccess = require('../Connection');
import { Schema } from 'mongoose';
import { IMessage } from '../../models';
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class MessageSchema {

    static get schema() {
        var schema = new Schema({
            content: {
                type: String,
                required: true
            },
            from: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            to: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            createdAt: {
                type: Date,
                default: Date.now()
            },
            isRead: {
                type: Boolean,
                default: false
            },
            ownerFriendship: {
                type: Schema.Types.ObjectId,
                ref: 'FriendShip'
            }
        });
        return schema;
    }
}
var schema = mongooseConnection.model<IMessage>('Message', MessageSchema.schema);
export = schema;
