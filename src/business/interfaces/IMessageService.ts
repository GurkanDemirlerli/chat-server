import { IMessage, MessageCreateModel, IChatMessageViewModel } from "../../models";

export interface IMessageService {
    add(item: MessageCreateModel): Promise<IChatMessageViewModel>;
    listChat(myId: string, friendId: string): Promise<IChatMessageViewModel[]>;
    sendMessage(message);
    makeChatMessagesReaded(myId: string, friendId: string): Promise<void>;
}