import { IMessageService, INotificationService } from './../../business';
import { injectable, inject } from 'inversify';
import { IOCTYPES } from './../../ioc/ioc-types.enum';
// import { AuthenticationService } from '../business/';
import 'reflect-metadata';
import { IMessageRepository } from '../../dataAccess/repository';
import { onlineUsers } from '../../socket/online-users';

@injectable()
export class MessagesController {

    constructor(
        @inject(IOCTYPES.MESSAGE_REPOSITORY) private _messageRepository: IMessageRepository,
    ) { }

    add(req, res, next) {
        this._messageRepository.create(req.body).then((message) => {
            var io = req.app.get('socketio');
            try {
                onlineUsers[message.to].socketIds.forEach(socketId => {
                    io.to(socketId).emit('receiveMessage', message);
                });
            } catch (error) {
                console.log('mesaj gitmedi, kullanıcı yok yada online degil');
                console.log(error);
            }
            return res.json({
                'success': true,
                'data': message
            });
        }).catch((error) => {
            return res.json({
                'success': false,
                'error': error
            });
        });
    }

    list(req, res, next) {
        this._messageRepository.list().then((data) => {
            return res.json({
                'success': true,
                'data': data
            });
        }).catch((error) => {
            return res.json({
                'success': false,
                'error': error
            });
        });
    }
}