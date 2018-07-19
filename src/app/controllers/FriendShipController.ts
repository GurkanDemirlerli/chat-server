import * as express from 'express';
import { injectable, inject } from 'inversify';
import { IOCTYPES } from '../../ioc/ioc-types.enum';
import {
    AuthenticationService,
    IFriendShipService,
    ILocalNotificationService
} from '../../business';
import {
    FriendshipRequestCreateModel,
    IFriendshipRequestViewModel,
    IFriendshipViewModel,
    ILocalNotificationCreateModel,
    ILocalNotificationViewModel,
    IReceivedFriendshipRequest,
    ISendedFriendshipRequest,
    IFriendViewModel
} from '../../models';
import { onlineUsers } from '../../socket/online-users';
import { ErrorHandler } from '../../errors/ErrorHandler';
import { LocalNotificationTypes } from '../../enums';
import 'reflect-metadata';

@injectable()
export class FriendShipController {

    constructor(
        @inject(IOCTYPES.FRIEND_SHIP_SERVICE) private _friendshipService: IFriendShipService,
        @inject(IOCTYPES.LOCAL_NOTIFICATION_SERVICE) private _localNotificationService: ILocalNotificationService
    ) { }

    public send(req: express.Request, res: express.Response, next: express.NextFunction) {
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            const friendshipRequest = new FriendshipRequestCreateModel(
                decodedToken._id,
                req.body.userId,
                req.body.requestMessage
            );
            return this._friendshipService.sendFriendshipRequest(friendshipRequest);
        }).then((data: IFriendshipRequestViewModel) => {
            let createdFriendshipRequest = data;
            var io = req.app.get('socketio');
            if (onlineUsers.hasOwnProperty((createdFriendshipRequest.receiver._id))) {
                onlineUsers[createdFriendshipRequest.receiver._id].socketIds.forEach(socketId => {
                    io.to(socketId).emit('receiveFriendShipRequest', 1);
                });
            }
            return res.status(201).json({
                success: true,
                data: createdFriendshipRequest
            });
        }).catch((error: Error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'send', 'FriendShipController');
        });
    }

    public cancel(req: express.Request, res: express.Response, next: express.NextFunction) {
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            const friendshipRequestId = req.params.id;
            return this._friendshipService.cancelFriendshipRequest(friendshipRequestId, decodedToken._id)
        }).then((cancelledFriendShipRequest: IFriendshipRequestViewModel) => {
            var io = req.app.get('socketio');
            if (onlineUsers.hasOwnProperty(cancelledFriendShipRequest.receiver._id)) {
                onlineUsers[cancelledFriendShipRequest.receiver._id].socketIds.forEach(socketId => {
                    io.to(socketId).emit('receiveFriendShipRequest', -1);
                });
            }
            return res.status(200).json({
                'success': true
            });
        }).catch((error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'cancel', 'FriendShipController');
        });
    }

    public accept(req: express.Request, res: express.Response, next: express.NextFunction) {
        let createdFriendship: IFriendshipViewModel;
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            const friendshipRequestId = req.params.id;
            return this._friendshipService.acceptFriendshipRequest(friendshipRequestId, decodedToken._id);
        }).then((data: IFriendshipViewModel) => {
            createdFriendship = data;
            let notificationModel: ILocalNotificationCreateModel = <ILocalNotificationCreateModel>{
                contentType: LocalNotificationTypes.FRIEND_REQUEST_ACCEPTED,
                from: createdFriendship.acceptor._id,
                to: createdFriendship.sender._id
            };
            return this._localNotificationService.createNotification(notificationModel);
        }).then((createdNotification: ILocalNotificationViewModel) => {
            let io = req.app.get('socketio');
            if (onlineUsers.hasOwnProperty(createdNotification.to)) {
                onlineUsers[createdNotification.to].socketIds.forEach(socketId => {
                    io.to(socketId).emit('receiveLocalNotification', createdNotification);
                });
            }
            return res.status(200).json({
                'success': true,
                'data': createdFriendship
            });
        }).catch((error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'accept', 'FriendShipController');
        });
    }

    public reject(req: express.Request, res: express.Response, next: express.NextFunction) {
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            const friendshipRequestId = req.params.id;
            return this._friendshipService.rejectFriendshipRequest(friendshipRequestId, decodedToken._id);
        }).then((rejectedFriendshipRequest: IFriendshipRequestViewModel) => {
            let notificationModel: ILocalNotificationCreateModel = <ILocalNotificationCreateModel>{
                contentType: LocalNotificationTypes.FRIEND_REQUEST_REJECTED,
                from: rejectedFriendshipRequest.receiver._id,
                to: rejectedFriendshipRequest.sender._id
            };
            return this._localNotificationService.createNotification(notificationModel);
        }).then((notification: ILocalNotificationViewModel) => {
            let io = req.app.get('socketio');
            if (onlineUsers.hasOwnProperty(notification.to as string)) {
                onlineUsers[notification.to as string].socketIds.forEach(socketId => {
                    io.to(socketId).emit('receiveLocalNotification', notification);
                });
            }
            return res.status(200).json({
                'success': true
            });
        }).catch((error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'reject', 'FriendShipController');
        });
    }

    public remove(req: express.Request, res: express.Response, next: express.NextFunction) {
        let myId: string;
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            const friendshipId = req.params.id;
            myId = decodedToken._id;
            return this._friendshipService.removeFriendship(friendshipId, myId)
        }).then((removedFriendId: string) => {
            var io = req.app.get('socketio');
            if (onlineUsers.hasOwnProperty(removedFriendId)) {
                onlineUsers[removedFriendId].socketIds.forEach(socketId => {
                    io.to(socketId).emit('friendRemoved', myId);
                });
            }
            return res.json({
                'success': true
            });
        }).catch((error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'remove', 'FriendShipController');
        });
    }

    public listSendedRequests(req: express.Request, res: express.Response, next: express.NextFunction) {
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            return this._friendshipService.listSendedRequestsForUser(decodedToken._id);
        }).then((data: ISendedFriendshipRequest[]) => {
            return res.status(200).json({
                'success': true,
                'data': data
            });
        }).catch((error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'listSendedRequests', 'FriendShipController');
        });
    }

    public listReceivedRequests(req: express.Request, res: express.Response, next: express.NextFunction) {
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            return this._friendshipService.listReceivedRequestsForUser(decodedToken._id);
        }).then((data: IReceivedFriendshipRequest[]) => {
            return res.status(200).json({
                'success': true,
                'data': data
            });
        }).catch((error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'listReceivedRequests', 'FriendShipController');
        });
    }

    public getReceivedRequestCount(req: express.Request, res: express.Response, next: express.NextFunction) {
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            return this._friendshipService.getReceivedRequestCount(decodedToken._id);
        }).then((data: number) => {
            return res.json({
                'success': true,
                'data': data
            });
        }).catch((error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'getReceivedRequestCount', 'FriendShipController');
        });
    }

    public listFriends(req: express.Request, res: express.Response, next: express.NextFunction) {
        let myId: string;
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            myId = decodedToken._id;
            return this._friendshipService.listFriends(myId);
        }).then((friends: IFriendViewModel[]) => {
            for (let i = 0; i < friends.length; i++) {
                if (onlineUsers.hasOwnProperty(friends[i]._id))
                    friends[i].status = 'online';
                else
                    friends[i].status = 'offline';
            }
            return res.status(200).json({
                'success': true,
                'data': friends
            });
        }).catch((error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'listMyFriends', 'FriendShipController');
        });
    }

    public findFriend(req: express.Request, res: express.Response, next: express.NextFunction) {
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            const friendId = req.params.friendId;
            const myId = decodedToken._id;
            return this._friendshipService.findMyFriend(myId, friendId);
        }).then((data: IFriendViewModel) => {
            if (onlineUsers.hasOwnProperty(data._id))
                data.status = 'online';
            else
                data.status = 'offline';
            return res.status(200).json({
                'success': true,
                'data': data
            });
        }).catch((error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'findFriend', 'FriendShipController');
        });
    }
}
