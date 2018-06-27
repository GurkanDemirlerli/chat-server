import { injectable } from 'inversify';
import MessageSchema = require("./../schemas/message.schema");
import { IMessageRepository } from './interfaces/IMessageRepository';
import { RepositoryBase } from './RepositoryBase';
import { IMessage } from './../../models';
import 'reflect-metadata';

@injectable()
export class MessageRepository extends RepositoryBase<IMessage> implements IMessageRepository {
    constructor() {
        super(MessageSchema)
    }

    list() {
        let p = new Promise<IMessage[]>((resolve, reject) => {
            MessageSchema.find({}).populate('owner', 'email').exec((err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
        return p;
    }

    findMessagesSendedToMyFriend(myId: string, friendId: string) {
        let p = new Promise<IMessage[]>((resolve, reject) => {
            MessageSchema
                .find({})
                .where('from').equals(myId)
                .where('to').equals(friendId)
                .populate('from', '_id name')
                .populate('to', '_id name')
                .sort('-createdAt')
                // .select('_id content from to')
                .exec((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });
        return p;
    }

    findMessagesBetweenMyFriend(myId: string, friendId: string) {
        let p = new Promise<IMessage[]>((resolve, reject) => {
            MessageSchema
                .find({})
                .where('from').in([myId, friendId])
                .where('to').in([myId, friendId])
                .populate('from', '_id name')
                .populate('to', '_id name')
                .sort('-createdAt')
                // .select('_id content from to')
                .exec((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });
        return p;
    }
}