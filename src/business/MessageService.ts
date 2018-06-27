import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { IOCTYPES } from '../ioc/ioc-types.enum';
import { IMessageRepository, IUserRepository } from './../dataAccess/repository';
import { IMessageService } from './interfaces';
import { IMessage } from '../models';

@injectable()
export class MessageService implements IMessageService {

    constructor(
        @inject(IOCTYPES.MESSAGE_REPOSITORY) private _messageRepository: IMessageRepository,
        @inject(IOCTYPES.USER_REPOSITORY) private _userRepository: IUserRepository
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
}

//========== TO DO =========
//  *  TASK EKLENIRKEN ATOMIK OLARAK EKLE.