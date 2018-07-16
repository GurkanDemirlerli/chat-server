import { injectable, inject } from 'inversify';
import { IOCTYPES } from '../ioc/ioc-types.enum';
import { IMessageRepository, IUserRepository, IFriendShipRepository } from '../dataAccess/repository';
import { IMessageService } from './interfaces';
import { IMessage, IChatMessageViewModel, MessageCreateModel } from '../models';
import 'reflect-metadata';

@injectable()
export class MessageService implements IMessageService {

    constructor(
        @inject(IOCTYPES.MESSAGE_REPOSITORY) private _messageRepository: IMessageRepository,
        @inject(IOCTYPES.USER_REPOSITORY) private _userRepository: IUserRepository,
        @inject(IOCTYPES.FRIENDSHIP_REPOSITORY) private _friendShipRepository: IFriendShipRepository,
    ) { }

    add(item: MessageCreateModel): Promise<IChatMessageViewModel> {
        return new Promise<IChatMessageViewModel>((resolve, reject) => {
            //arkadaslik kontrolü yap.
            this._messageRepository.create(item).then((res: IMessage) => {
                delete res.__v;
                resolve(<IChatMessageViewModel>res);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    listChat(myId: string, friendId: string): Promise<IChatMessageViewModel[]> {
        return new Promise<IChatMessageViewModel[]>((resolve, reject) => {
            this._messageRepository.findMessagesBetweenTwoUsers(myId, friendId).then((res: IMessage[]) => {
                res = res.map(r => {
                    delete (r['_doc'] as IMessage).__v;
                    return r['_doc'];
                });
                resolve(<IChatMessageViewModel[]>res);
            }).catch((error: Error) => {
                reject(error);
            })
        });
    }

    sendMessage(message) {
        return new Promise<IMessage>((resolve, reject) => {
            this._messageRepository.create(message).then((res) => {
                if (res) {
                    this._messageRepository.findMessage(res._id).then((res) => {
                        resolve(res);
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    reject('Error: Mesaj eklenmedi.');
                }
            }).catch((error: Error) => {
                reject(error);
            })
        });
    }

    makeChatMessagesReaded(myId: string, friendId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._messageRepository.makeChatMessagesReaded(myId, friendId).then(() => {
                resolve();
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }
}
