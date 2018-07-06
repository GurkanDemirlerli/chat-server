import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { IOCTYPES } from '../ioc/ioc-types.enum';
import { IMessageRepository, IUserRepository, IFriendShipRepository } from './../dataAccess/repository';
import { IMessageService } from './interfaces';
import { IMessage } from '../models';

@injectable()
export class MessageService implements IMessageService {

    constructor(
        @inject(IOCTYPES.MESSAGE_REPOSITORY) private _messageRepository: IMessageRepository,
        @inject(IOCTYPES.USER_REPOSITORY) private _userRepository: IUserRepository,
        @inject(IOCTYPES.FRIENDSHIP_REPOSITORY) private _friendShipRepository: IFriendShipRepository,
    ) { }

    add(message) {
        let p = new Promise<any>((resolve, reject) => {
            this._messageRepository.create(message).then((messageRes: IMessage) => {
                this._userRepository.findByIdAndPush(messageRes.from, { messages: messageRes._id }).then((userRes) => {
                    //make something optional
                }).catch((error) => {
                    //delete created messages
                    reject(error.message);
                });
                resolve(messageRes);
            }).catch((error) => {
                reject(error.message);
            });
        });
        return p;
    }

    list() {
        let p = new Promise<any>((resolve, reject) => {
            this._messageRepository.list().then((res) => {
                resolve(res);
            }).catch((error) => {
                reject(error.message);
            });
        });
        return p;
    }

    findMessagesBetweenMyFriend(myId: string, friendId: string): Promise<IMessage[]> {
        return new Promise<IMessage[]>((resolve, reject) => {
            this._friendShipRepository.arkadaslikKontrol(myId, friendId).then((arkadaslarMı) => {
                if (arkadaslarMı) {
                    this._messageRepository.findMessagesBetweenTwoUsers(myId, friendId).then((messages: IMessage[]) => {
                        resolve(messages);
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    reject('Error : Arkadas Degiller');
                }
            }).catch((error) => {
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
            }).catch((error) => {
                reject(error);
            })
        });
    }

    makeAllReceivedMessagesReadedFromMyFriend(myId: string, friendId: string): Promise<Boolean> {
        return new Promise<any>((resolve, reject) => {
            this._messageRepository.makeAllReceivedMessagesReadedFromUser(myId, friendId).then((res) => {
                if (res) {
                    resolve(true);
                } else {
                    reject(false);
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    findUnreadedMessagesCount(myId: string, friendId: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this._messageRepository.findUnreadedMessagesCount(myId, friendId).then((unReadedMessagesCount) => {
                resolve(unReadedMessagesCount);
            }).catch((error) => {
                reject(error);
            });
        });
    }
}
