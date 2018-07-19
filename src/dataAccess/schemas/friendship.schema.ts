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
            unreadMessagesCountForSender: {
                type: Number,
                default: 0
            },
            unreadMessagesCountForAcceptor: {
                type: Number,
                default: 0
            }
        });

        schema.virtual('chat', {
            ref: 'Message',
            localField: '_id',
            foreignField: 'ownerFriendship'
        });

        schema.set('toObject', { virtuals: true });
        schema.set('toJSON', { virtuals: true });

        return schema;
    }
}
var schema = mongooseConnection.model<IFriendShip>('FriendShip', FriendShipSchema.schema);
export = schema;
