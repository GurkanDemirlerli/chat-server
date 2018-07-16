import { injectable } from 'inversify';
import MessageSchema = require("../schemas/message.schema");
import { IMessageRepository } from './interfaces/IMessageRepository';
import { RepositoryBase } from './RepositoryBase';
import { IMessage } from '../../models';
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

    findMessagesBetweenTwoUsers(requestorId: string, responderId: string) {
        let p = new Promise<IMessage[]>((resolve, reject) => {
            MessageSchema
                .find({})
                .where('from').in([requestorId, responderId])
                .where('to').in([requestorId, responderId])
                .sort('createdAt')
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

    makeChatMessagesReaded(receiverId: string, senderId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            MessageSchema
                .updateMany({ to: receiverId, from: senderId, isRead: false }, { isRead: true })
                .exec((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
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