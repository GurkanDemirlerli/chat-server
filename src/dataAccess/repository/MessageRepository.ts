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
                .sort('createdAt')
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

    findMessagesBetweenTwoUsers(requestorId: string, responderId: string) {
        let p = new Promise<IMessage[]>((resolve, reject) => {
            MessageSchema
                .find({})
                .where('from').in([requestorId, responderId])
                .where('to').in([requestorId, responderId])
                .populate('from', '_id name')
                .populate('to', '_id name')
                .sort('createdAt')
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

    findMessage(messageId): Promise<IMessage> {
        let p = new Promise<IMessage>((resolve, reject) => {
            MessageSchema
                .findById(messageId)
                .populate('from', '_id name')
                .populate('to', '_id name')
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

    makeAllReceivedMessagesReadedFromUser(receiverId: string, senderId: string): Promise<Boolean> {

        return new Promise<Boolean>((resolve, reject) => {
            MessageSchema
                .updateMany({ to: receiverId, from: senderId, isRead: false }, { isRead: true })
                .exec((err, res) => {
                    if (err) {
                        reject(false);
                    } else {
                        resolve(true);
                    }
                });
        });
    }

    findUnreadedMessagesCount(receiverId: string, senderId: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            MessageSchema
                .find({ to: receiverId, from: senderId, isRead: false })
                .count()
                .exec((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });
    }
}