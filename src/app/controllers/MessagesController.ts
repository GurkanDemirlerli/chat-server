import { IMessageService, AuthenticationService } from './../../business';
import { injectable, inject } from 'inversify';
import { IOCTYPES } from './../../ioc/ioc-types.enum';
import { onlineUsers } from '../../socket/online-users';
import 'reflect-metadata';


@injectable()
export class MessagesController {

    constructor(
        @inject(IOCTYPES.MESSAGE_SERVICE) private _messageService: IMessageService,
    ) { }

    add(req, res, next) {
        try {
            AuthenticationService.checkAuthentication(req).then((isAuth) => {
                if (isAuth) {
                    const message = {
                        from: isAuth._id,
                        to: req.body.to,
                        content: req.body.content
                    }
                    this._messageService.sendMessage(message).then((data) => {
                        var io = req.app.get('socketio');
                        try {
                            onlineUsers[data.to._id].socketIds.forEach(socketId => {
                                io.to(socketId).emit('receiveMessage', data);
                            });
                        } catch (error) {
                            console.log('mesaj realtime gitmedi, kullanıcı yok yada online degil');
                            console.log(error);
                        }
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
                } else {
                    return res.json({
                        'success': false,
                        'error': 'UnAuthorized'
                    });
                }
            })
        } catch (error) {
            return res.json({
                'success': false,
                'error': 'Unhandled error'
            });
        }
    }

    makeAllReceivedMessagesReadedFromMyFriend(req, res, next) {
        try {
            AuthenticationService.checkAuthentication(req).then((isAuth) => {
                if (isAuth) {
                    const friendId = req.params.friendId;
                    this._messageService.makeAllReceivedMessagesReadedFromMyFriend(isAuth._id, friendId).then((data) => {
                        var io = req.app.get('socketio');
                        try {
                            onlineUsers[friendId].socketIds.forEach(socketId => {
                                io.to(socketId).emit('messagesReaded', isAuth._id);
                            });
                        } catch (error) {
                            console.log('mesaj realtime gitmedi, kullanıcı yok yada online degil');
                            console.log(error);
                        }
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
                } else {
                    return res.json({
                        'success': false,
                        'error': 'UnAuthorized'
                    });
                }
            })
        } catch (error) {
            return res.json({
                'success': false,
                'error': 'Unhandled error'
            });
        }
    }
}