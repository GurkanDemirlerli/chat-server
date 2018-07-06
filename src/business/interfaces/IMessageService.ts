import { IMessage } from "../../models";

export interface IMessageService {
    add: (message) => any;
    list: () => any;
    findMessagesBetweenMyFriend(myId: string, friendId: string): Promise<IMessage[]>;
    sendMessage(message);
    makeAllReceivedMessagesReadedFromMyFriend(myId: string, friendId: string): Promise<Boolean>;
    findUnreadedMessagesCount(myId: string, friendId: string): Promise<number>;
}