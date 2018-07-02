import { IMessage } from "../../models";

export interface IMessageService {
    add: (message) => any;
    list: () => any;
    findMessagesBetweenMyFriend(myId: string, friendId: string): Promise<IMessage[]>;
    sendMessage(message);
}