import { IRepositoryBase } from './IRepositoryBase';
import { IMessage } from '../../../models';

export interface IMessageRepository extends IRepositoryBase<IMessage> {
    list: () => Promise<IMessage[]>;
    findMessagesBetweenTwoUsers(requestorId: string, responderId: string);
    findMessage(messageId): Promise<IMessage>;
    makeChatMessagesReaded(receiverId: string, senderId: string): Promise<void>;
    findUnreadedMessagesCount(receiverId: string, senderId: string): Promise<number>;
}