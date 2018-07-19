import * as express from 'express';
import { IMessageService, AuthenticationService } from '../../business';
import { injectable, inject } from 'inversify';
import { IOCTYPES } from '../../ioc/ioc-types.enum';
import { validate } from 'class-validator';
import { AppError } from '../../errors/AppError';
import { MessageCreateModel, IChatMessageViewModel } from '../../models';
import { onlineUsers } from '../../socket/online-users';
import { ErrorHandler } from '../../errors/ErrorHandler';
import 'reflect-metadata';


@injectable()
export class MessagesController {

    constructor(
        @inject(IOCTYPES.MESSAGE_SERVICE) private _messageService: IMessageService,
    ) { }

    public add(req: express.Request, res: express.Response, next: express.NextFunction) {
        let message: MessageCreateModel;
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            message = new MessageCreateModel(
                decodedToken._id,
                req.body.to,
                req.body.content,
                req.body.ownerFriendship
            )
            //validation eklenecek
            return validate(message);
        }).then((errors) => {
            if (errors.length > 0) {
                throw new AppError(
                    'Validation Error',
                    JSON.stringify(errors),
                    400
                )
            }
            return this._messageService.add(message);
        }).then((data: IChatMessageViewModel) => {
            var io = req.app.get('socketio');
            if (onlineUsers.hasOwnProperty(data.to)) {
                onlineUsers[data.to].socketIds.forEach(socketId => {
                    io.to(socketId).emit('receiveMessage', data);
                });
            }
            return res.status(201).json({
                success: true,
                data: data
            });
        }).catch((error: Error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'add', 'MessagesController');
        });
    }

    public listChat(req: express.Request, res: express.Response, next: express.NextFunction) {
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            const myId = decodedToken._id;
            const friendId = req.params.friendId;
            return this._messageService.listChat(myId, friendId);
        }).then((data: IChatMessageViewModel[]) => {
            return res.status(200).json({
                success: true,
                data: data
            });
        }).catch((error: Error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'listChat', 'MessagesController');
        });
    }

    public makeChatMessagesReaded(req: express.Request, res: express.Response, next: express.NextFunction) {
        let myId: string;
        let friendId: string;
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            myId = decodedToken._id;
            friendId = req.params.friendId;
            return this._messageService.makeChatMessagesReaded(myId, friendId);
        }).then(() => {
            var io = req.app.get('socketio');
            if (onlineUsers.hasOwnProperty(friendId)) {
                onlineUsers[friendId].socketIds.forEach(socketId => {
                    io.to(socketId).emit('messagesReaded', myId);
                });
            }
            return res.status(200).json({
                success: true,
            });
        }).catch((error: Error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'makeChatMessagesReaded', 'MessagesController');
        });
    }
}