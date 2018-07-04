import DataAccess = require('../Connection');
import { Schema } from 'mongoose';
import { ILocalNotification } from '../../models';
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class LocalNotificationSchema {

    static get schema() {
        var schema = new Schema({
            contentType: {
                type: Number
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
            }
        });
        return schema;
    }
}
var schema = mongooseConnection.model<ILocalNotification>('LocalNotification', LocalNotificationSchema.schema);
export = schema;
