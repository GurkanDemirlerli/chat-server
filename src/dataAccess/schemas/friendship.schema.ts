import { AppError } from '../../errors/AppError';
import DataAccess = require('../Connection');
import { Schema } from 'mongoose';
import { IFriendShip } from '../../models';
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class FriendShipSchema {

    static get schema() {
        var schema = new Schema({
            sender: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            acceptor: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            createdAt: {
                type: Date,
                default: Date.now()
            },
        });

        return schema;
    }
}
var schema = mongooseConnection.model<IFriendShip>('FriendShip', FriendShipSchema.schema);
export = schema;
