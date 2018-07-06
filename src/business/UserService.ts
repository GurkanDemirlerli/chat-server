import {
    ISignupModel,
    ILoginModel,
    IUser,
    IFriendRequest,
    IFriendShip,
    IUserSearchResultModel,
    ILocalNotification
} from './../models';
import { injectable, inject } from 'inversify';
import { IOCTYPES } from '../ioc/ioc-types.enum';
import { IUserService } from 'src/business';
import {
    IUserRepository,
    IFriendRequestRepository,
    IFriendShipRepository,
    ILocalNotificationRepository,
    IMessageRepository
} from './../dataAccess/repository';
import * as jwt from 'jsonwebtoken';
import 'reflect-metadata';
import { LocalNotificationTypes } from '../util/local-notification-types/local-notification-types.enum';

@injectable()
export class UserService implements IUserService {

    constructor(
        @inject(IOCTYPES.USER_REPOSITORY) private _userRepository: IUserRepository,
        @inject(IOCTYPES.FRIENDREQUEST_REPOSITORY) private _friendRequestRepository: IFriendRequestRepository,
        @inject(IOCTYPES.FRIENDSHIP_REPOSITORY) private _friendShipRepository: IFriendShipRepository,
        @inject(IOCTYPES.LOCALNOTIFICATION_REPOSITORY) private _localNotificationRepository: ILocalNotificationRepository,
        @inject(IOCTYPES.MESSAGE_REPOSITORY) private _messageRepository: IMessageRepository,
    ) { }

    signup(item: ISignupModel): Promise<IUser> {
        let p = new Promise<IUser>((resolve, reject) => {
            this._userRepository.create(item).then((res: IUser) => {
                resolve(<IUser>res);
            }).catch((error) => {
                reject(error.message);
            });
        });
        return p;
    }

    login(item: ILoginModel): Promise<any> {
        let p = new Promise<any>((resolve, reject) => {
            this._userRepository.findOne({ 'email': item.email, 'password': item.password }, {}, {}).then((res: IUser) => {
                if (res) {
                    var token = jwt.sign({ _id: res._id, email: res.email }, 'MySecret', { expiresIn: 86400000 });
                    var email = res.email;
                    var id = res._id;
                    var result = {
                        token: token,
                        email: email,
                        id: id
                    }
                    resolve(result);
                } else {
                    reject('Wrong username or password');
                }
            }).catch((error) => {
                reject(error)
            });
        });
        return p;
    }

    changeNotificationId(userId, notifyId): Promise<any> {
        let p = new Promise<any>((resolve, reject) => {
            this._userRepository.changeNotificationId(userId, notifyId).then((res: IUser) => {
                if (res) {
                    console.log("User Service Resolve.", res.notificationId)
                    resolve(res.notificationId);
                }
                else {
                    console.log("User Service Reject.")
                    reject('ERROR');
                }
            })
        });
        return p;
    }

    deleteNotificationId(userId): Promise<any> {
        let p = new Promise<any>((resolve, reject) => {
            this._userRepository.deleteNotificationId(userId).then((res: IUser) => {
                if (res) {
                    resolve('SUCCESS');
                } else {
                    reject('ERROR');
                }
            });
        });
        return p;
    }

    sendFriendShipRequest(item: IFriendRequest): Promise<IFriendRequest> {
        return new Promise<IFriendRequest>((resolve, reject) => {
            this._friendRequestRepository.create(item).then((res) => {
                if (res) {
                    resolve(res);
                } else {
                    reject('Error : sonuc bulunamadi.');
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    acceptFriendShipRequest(friendRequestId: string, acceptorId: string): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this._friendRequestRepository.findById(friendRequestId).then((res) => {

                if (res.receiver.toString() == acceptorId) {
                    this._friendRequestRepository.acceptRequest(friendRequestId).then((res) => {
                        if (res) {
                            this.beFriends({ sender: res.sender, acceptor: res.receiver }).then((res) => {
                                if (res) {
                                    let notificationModel: ILocalNotification = <ILocalNotification>{
                                        contentType: LocalNotificationTypes.FRIEND_REQUEST_ACCEPTED,
                                        from: res.acceptor,
                                        to: res.sender
                                    };
                                    this._localNotificationRepository.create(notificationModel).then((notification) => {
                                        resolve([res, notification]);
                                    }).catch((error) => {
                                        resolve([res, error]);//Daha sonra düzelt
                                        console.log('Error: Bildirim Eklenmedi');
                                    });
                                } else {
                                    reject('Error : sonuc bulunamadi.');
                                }
                            }).catch((error => {
                                //Geri Al
                                reject(error);
                            }));
                        } else {
                            reject('Error : sonuc bulunamadi.');
                        }
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    console.log('Error: UnAuthorized');
                    reject('Error: UnAuthorized');
                }
            }).catch((error) => {
                // console.log(error);
                console.log('REJECT');
                reject(error);
            });
        });
    }

    rejectFriendShipRequest(friendRequestId: string, rejectorId: string): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this._friendRequestRepository.findById(friendRequestId).then((res) => {

                if (res.receiver.toString() == rejectorId) {
                    this._friendRequestRepository.rejectRequest(friendRequestId).then((res) => {
                        if (res) {
                            let notificationModel: ILocalNotification = <ILocalNotification>{
                                contentType: LocalNotificationTypes.FRIEND_REQUEST_REJECTED,
                                from: res.receiver,
                                to: res.sender
                            };
                            this._localNotificationRepository.create(notificationModel).then((notification) => {
                                resolve([res, notification]);
                            }).catch((error) => {
                                resolve([res, error]);//Daha sonra düzelt
                                console.log('Error: Bildirim Eklenmedi');
                            });
                        } else {
                            reject('Error : sonuc bulunamadi.');
                        }
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    console.log('Error: UnAuthorized');
                    reject('Error: UnAuthorized');
                }
            }).catch((error) => {
                // console.log(error);
                console.log('REJECT');
                reject(error);
            });

        });
    }

    cancelSendedFriendShipRequest(friendRequestId: string, iptalEden: string): Promise<IFriendRequest> {
        console.log(friendRequestId);
        return new Promise<IFriendRequest>((resolve, reject) => {
            this._friendRequestRepository.findById(friendRequestId).then((res) => {

                if (res.sender.toString() == iptalEden) {
                    this._friendRequestRepository.rejectRequest(friendRequestId).then((res) => {
                        if (res) {
                            resolve(res);
                        } else {
                            reject('Error : sonuc bulunamadi.');
                        }
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    console.log('Error: UnAuthorized');
                    reject('Error: UnAuthorized');
                }
            }).catch((error) => {
                // console.log(error);
                console.log('REJECT');
                reject(error);
            });

        });
    }

    private beFriends(item): Promise<IFriendShip> {
        return new Promise<IFriendShip>((resolve, reject) => {
            this._friendShipRepository.create(item).then((res) => {
                if (res) {
                    this._userRepository.findByIdAndPush(<string>res.sender, { SendedFriendShips: res._id }).then((senderRes) => {
                        this._userRepository.findByIdAndPush(<string>res.acceptor, { AcceptedFriendShips: res._id }).then((acceptorRes) => {
                            resolve(res);
                        }).catch((error) => {
                            reject(error);
                        });
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    reject('Error : sonuc bulunamadi.');
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    listMyFriends(myId: string): Promise<any[]> {
        return new Promise<any>((resolve, reject) => {
            this._userRepository.listMyFriends(myId).then((res) => {
                if (res) {
                    let friends = [];
                    res.AcceptedFriendShips.forEach((friendship) => {
                        friends.push(friendship.sender);
                    });
                    res.SendedFriendShips.forEach((friendship) => {
                        friends.push(friendship.acceptor);
                    });
                    resolve(friends);
                } else {
                    reject('Error : sonuc bulunamadi.');
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    searchUsers(name, limit, skip, myId): Promise<IUserSearchResultModel[]> {
        return new Promise<IUserSearchResultModel[]>((resolve, reject) => {
            let users: IUserSearchResultModel[] = [];
            this._userRepository.searchUsers(name, limit, skip).then(async (res) => {
                if (res) {
                    await res.forEach(async (userRes, index) => {
                        let user: IUserSearchResultModel = <IUserSearchResultModel>new Object();
                        user._id = userRes._id;
                        user.name = userRes.name;
                        user.email = userRes.email;
                        if (user._id.toString() != myId) {
                            await this._friendShipRepository.arkadaslikKontrol(myId, userRes._id).then((arkadaslarMı) => {
                                if (arkadaslarMı) {
                                    user.isFriend = true;
                                    //arkadas iseler isfriend true olacak.
                                } else {
                                    user.isFriend = false;
                                }
                            }).catch((error) => {
                                reject(error);
                            });

                            await this._friendRequestRepository.gidenArkadaslikIstegiVarmi(myId, userRes._id).then((gidenIstekVar) => {
                                if (gidenIstekVar) {
                                    user.isSendedRequestWaiting = true;
                                    user.sendedRequestWaiting = gidenIstekVar;
                                } else {
                                    user.isSendedRequestWaiting = false;
                                }
                            }).catch((error) => {
                                user.isSendedRequestWaiting = false;
                            });

                            await this._friendRequestRepository.gelenArkadaslikIstegiVarmi(myId, userRes._id).then((gelenIstekVar) => {
                                if (gelenIstekVar) {
                                    user.isReceivedRequestWaiting = true;
                                    user.receivedRequestWaiting = gelenIstekVar;
                                } else {
                                    user.isReceivedRequestWaiting = false;
                                }
                            }).catch((error) => {
                                user.isReceivedRequestWaiting = false;
                            });
                            user.isSelf = false;
                        } else {
                            user.isSelf = true;
                            user.isReceivedRequestWaiting = false;
                            user.isSendedRequestWaiting = false;
                            user.isFriend = false;
                        }
                        console.log('UP', user);
                        users.push(user);
                        if (users.length === res.length) {
                            console.log('DOWN', users);
                            resolve(users);
                        }
                    });

                } else {
                    reject('Error : sonuc bulunamadi.');
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    findMyFriend(myId, friendId): Promise<IUser> {
        return new Promise<IUser>((resolve, reject) => {
            this._friendShipRepository.arkadaslikKontrol(myId, friendId).then((arkadaslarMı) => {
                if (arkadaslarMı) {
                    this._userRepository.findById(friendId).then((friend) => {
                        if (friend) {
                            resolve(friend);
                        } else {
                            reject('Error : Boyle bir kullanici yok.');
                        }
                    }).catch((error) => {
                        reject(error);
                    });
                } else {
                    reject('Error : Arkadas Degiller');
                }
            })
        });
    }

    getMyProfileCard(myId): Promise<IUser> {
        return new Promise<IUser>((resolve, reject) => {
            this._userRepository.getProfileCard(myId).then((profileCard) => {
                if (profileCard) {
                    resolve(profileCard);
                } else {
                    reject('Error : Boyle bir kullanici yok.');
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    getMyNotifications(myId: string): Promise<ILocalNotification[]> {
        return new Promise<ILocalNotification[]>((resolve, reject) => {
            this._localNotificationRepository.findNotificationsForOne(myId).then((res) => {
                console.log(res);
                resolve(res);
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    }

    getUnReadedNotificationsCount(myId: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this._localNotificationRepository.findUnreadedNotificationsCount(myId).then((res) => {
                console.log(res);
                resolve(res);
            }).catch((error) => {
                reject(error);
            })
        });
    }

    makeAllNotificationsReaded(myId: string): Promise<Boolean> {
        return new Promise<Boolean>((resolve, reject) => {
            this._localNotificationRepository.makeAllNotificationsReadedForOne(myId).then((res) => {
                console.log(res);
                resolve(res);
            }).catch((error) => {
                reject(error);
            })
        });
    }

}
