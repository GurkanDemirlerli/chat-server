import { IUserService, IMessageService } from './../../business';
import { injectable, inject } from 'inversify';
import { IOCTYPES } from './../../ioc/ioc-types.enum';
import { ISignupModel, SignupModel, ILoginModel, LoginModel } from './../../models';
import 'reflect-metadata';
import { validate } from 'class-validator';
import { AuthenticationService } from '../../business';
import { onlineUsers } from '../../socket/online-users';

@injectable()
export class UsersController {

    constructor(
        @inject(IOCTYPES.USER_SERVICE) private _userService: IUserService,
        @inject(IOCTYPES.MESSAGE_SERVICE) private _messageService: IMessageService
    ) { }

    signup(req, res, next) {
        let signupModel: SignupModel = new SignupModel(<ISignupModel>req.body)
        validate(signupModel).then((errors) => {
            //#region TEMP Compare
            // if (signupModel.password !== signupModel.passwordVerify) {
            //     res.json({
            //         'success': false,
            //         'error': 'Password and Verify not match'
            //     });
            // }
            // //#endregion
            if (errors.length > 0) {
                console.log('11111111111');
                return res.json({
                    'success': false,
                    'data': errors
                });
            } else {
                this._userService.signup(signupModel).then((data) => {
                    console.log('44444444444');

                    return res.json({
                        'success': true,
                        'data': data
                    });
                }).catch((error) => {
                    console.log('555555555555');

                    return res.json({
                        'success': false,
                        'error': error
                    });
                });
            }
        }).catch((error) => {
            console.log('333333333333');

            return res.json({
                'success': false,
                'error': 'Unknown error'
            });
        });

    }

    friendShipRequest(req, res, next) {
        try {
            AuthenticationService.checkAuthentication(req).then((isAuth) => {
                if (isAuth) {
                    const model = {
                        sender: isAuth._id,
                        receiver: req.body.receiver,
                        requestMessage: req.body.requestMessage
                    }
                    this._userService.sendFriendShipRequest(model).then((data) => {
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
            res.json({
                'success': false,
                'error': 'Unhandled error'
            });
        }
    }

    acceptFriendShipRequest(req, res, next) {
        try {
            AuthenticationService.checkAuthentication(req).then((isAuth) => {
                if (isAuth) {
                    const friendRequestId = req.body.friendRequestId;
                    const acceptorId = isAuth._id;
                    this._userService.acceptFriendShipRequest(friendRequestId, acceptorId).then((data) => {
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

    listMyFriends(req, res, next) {
        try {
            AuthenticationService.checkAuthentication(req).then((isAuth) => {
                if (isAuth) {
                    const myId = isAuth._id;
                    this._userService.listMyFriends(myId).then((data) => {
                        let friends = [];
                        data.forEach(friend => {
                            if (onlineUsers[friend._id]) {
                                friend.status = 'online';
                            } else {
                                friend.status = 'offline';
                            }
                            friends.push({
                                _id: friend._id,
                                email: friend.email,
                                name: friend.name,
                                about: friend.about,
                                status: friend.status
                            });
                        });
                        return res.json({
                            'success': true,
                            'data': friends
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

    login(req, res, next) {
        let loginModel: LoginModel = new LoginModel(<ILoginModel>req.body)
        this._userService.login(loginModel).then((data) => {
            // var io = req.app.get('socketio');
            // io.emit('hi', onlineUsers);
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

    changeNotificationId(req, res, next) {
        this._userService.changeNotificationId(req.body.userId, req.body.notificationId).then((data) => {
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

    deleteNotificationId(req, res, next) {
        this._userService.deleteNotificationId(req.body.userId).then((data) => {
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

    findMyFriend(req, res, next) {
        try {
            AuthenticationService.checkAuthentication(req).then((isAuth) => {
                if (isAuth) {
                    const myId = isAuth._id;
                    const friendId = req.params.friendId;
                    this._userService.findMyFriend(myId, friendId).then((data) => {
                        let status;
                        if (onlineUsers[data._id]) {
                            status = 'online';
                        } else {
                            status = 'offline';
                        }
                        const friend = {
                            _id: data._id,
                            email: data.email,
                            name: data.name,
                            about: data.about,
                            status: status
                        }
                        return res.json({
                            'success': true,
                            'data': friend
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


    getMessagesBetweenMyFriend(req, res, next) {
        try {
            AuthenticationService.checkAuthentication(req).then((isAuth) => {
                if (isAuth) {
                    const myId = isAuth._id;
                    const friendId = req.params.friendId;
                    this._messageService.findMessagesBetweenMyFriend(myId, friendId).then((data) => {
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

    getMyProfileCard(req, res, next) {
        try {
            AuthenticationService.checkAuthentication(req).then((isAuth) => {
                if (isAuth) {
                    const myId = isAuth._id;
                    this._userService.getMyProfileCard(myId).then((data) => {
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
            });
        } catch (error) {
            return res.json({
                'success': false,
                'error': 'Unhandled error'
            });
        }
    }

    searchUsersByName(req, res, next) {
        try {
            AuthenticationService.checkAuthentication(req).then((isAuth) => {
                if (isAuth) {
                    const name = req.query.name;
                    this._userService.searchUsers(name, 20, 0, isAuth._id).then((data) => {
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