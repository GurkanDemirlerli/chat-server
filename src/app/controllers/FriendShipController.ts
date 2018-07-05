import { AuthenticationService, IUserService } from './../../business';
import { injectable, inject } from 'inversify';
import { IOCTYPES } from './../../ioc/ioc-types.enum';
import 'reflect-metadata';
import { onlineUsers } from '../../socket/online-users';

@injectable()
export class FriendShipController {

    constructor(
        @inject(IOCTYPES.USER_SERVICE) private _userService: IUserService,
    ) { }
    sendFriendShipRequest(req, res, next) {
        try {
            AuthenticationService.checkAuthentication(req).then((isAuth) => {
                if (isAuth) {
                    const friendShipRequest = {
                        sender: isAuth._id,
                        receiver: req.body.receiver
                    }
                    this._userService.sendFriendShipRequest(friendShipRequest).then((data) => {
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
            }).catch((error) => {
                return res.json({
                    'success': false,
                    'error': error
                });
            });
        } catch (error) {
            return res.json({
                'success': false,
                'error': 'Unhandled error'
            });
        }
    }

    acceptFriendShipRequest(req, res, next) {
        try {
            AuthenticationService.checkAuthentication(req).then((isAuth) => {
                if (isAuth) {
                    const friendShipRequestId = req.body.friendShipRequestId;
                    this._userService.acceptFriendShipRequest(friendShipRequestId, isAuth._id).then(([friendship, notification]) => {
                        var io = req.app.get('socketio');
                        console.log('notification: ', notification);
                        try {
                            onlineUsers[(friendship.sender as string)].socketIds.forEach(socketId => {
                                io.to(socketId).emit('receiveLocalNotification', notification);
                            });
                        } catch (error) {
                            console.log('bildirim realtime gitmedi, kullanıcı yok yada online degil');
                            console.log(error);
                        }

                        return res.json({
                            'success': true,
                            'data': friendship
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
            }).catch((error) => {
                return res.json({
                    'success': false,
                    'error': error
                });
            });
        } catch (error) {
            return res.json({
                'success': false,
                'error': 'Unhandled error'
            });
        }
    }

    rejectFriendShipRequest(req, res, next) {
        try {
            AuthenticationService.checkAuthentication(req).then((isAuth) => {
                if (isAuth) {
                    const friendShipRequestId = req.body.friendShipRequestId;
                    this._userService.rejectFriendShipRequest(friendShipRequestId, isAuth._id).then((data) => {
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
            }).catch((error) => {
                return res.json({
                    'success': false,
                    'error': error
                });
            });
        } catch (error) {
            return res.json({
                'success': false,
                'error': 'Unhandled error'
            });
        }
    }

    cancelSendedFriendShipRequest(req, res, next) {
        console.log(req.body);
        try {
            AuthenticationService.checkAuthentication(req).then((isAuth) => {
                if (isAuth) {
                    const friendShipRequestId = req.body.friendShipRequestId;
                    this._userService.cancelSendedFriendShipRequest(friendShipRequestId, isAuth._id).then((data) => {
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
            }).catch((error) => {
                return res.json({
                    'success': false,
                    'error': error
                });
            });
        } catch (error) {
            return res.json({
                'success': false,
                'error': 'Unhandled error'
            });
        }
    }
}
