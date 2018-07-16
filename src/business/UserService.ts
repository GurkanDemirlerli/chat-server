import {
    SignupInput,
    IUser,
    IUserSearchResultModel,
    ILocalNotification,
    LoginInput,
    ILoginResult,
    IProfileCard
} from '../models';
import { injectable, inject } from 'inversify';
import { IOCTYPES } from '../ioc/ioc-types.enum';
import { IUserService } from '.';
import {
    IUserRepository,
    IFriendRequestRepository,
    IFriendShipRepository,
    ILocalNotificationRepository,
} from '../dataAccess/repository';
import * as jwt from 'jsonwebtoken';
import 'reflect-metadata';

@injectable()
export class UserService implements IUserService {

    constructor(
        @inject(IOCTYPES.USER_REPOSITORY) private _userRepository: IUserRepository,
        @inject(IOCTYPES.FRIENDREQUEST_REPOSITORY) private _friendRequestRepository: IFriendRequestRepository,
        @inject(IOCTYPES.FRIENDSHIP_REPOSITORY) private _friendShipRepository: IFriendShipRepository,
        @inject(IOCTYPES.LOCALNOTIFICATION_REPOSITORY) private _localNotificationRepository: ILocalNotificationRepository,
    ) { }

    signup(item: SignupInput): Promise<IProfileCard> {
        return new Promise<IProfileCard>((resolve, reject) => {
            this._userRepository.create(item).then((res) => {
                delete res.password;
                delete res.notificationId;
                delete res.SendedFriendShips;
                delete res.AcceptedFriendShips;
                delete res.__v;
                resolve(<IProfileCard>res);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    login(item: LoginInput): Promise<ILoginResult> {
        return new Promise<ILoginResult>((resolve, reject) => {
            this._userRepository.findOne({
                'email': item.getEmail,
                'password': item.getPassword
            }, {}, {}).then((res: IUser) => {
                if (!res) {
                    reject('Wrong username or password');
                }
                let token = jwt.sign({
                    _id: res._id,
                    username: res.username,
                    email: res.email,
                    firstname: res.username,
                    lastname: res.lastname,
                }, 'MySecret', { expiresIn: 86400000 });

                let loginResult: ILoginResult = <ILoginResult>{
                    id: res._id,
                    email: res.email,
                    token: token,
                };
                resolve(loginResult);
            }).catch((error) => {
                reject(error)
            });
        });
    }

    changeNotificationId(userId, notifyId): Promise<any> {
        return new Promise<any>((resolve, reject) => {
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
    }

    deleteNotificationId(userId): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this._userRepository.deleteNotificationId(userId).then((res: IUser) => {
                if (res) {
                    resolve('SUCCESS');
                } else {
                    reject('ERROR');
                }
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
                        user.username = userRes.username;
                        user.firstname = userRes.firstname;
                        user.lastname = userRes.lastname;
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

    getMyProfileCard(myId): Promise<IProfileCard> {
        return new Promise<IProfileCard>((resolve, reject) => {
            this._userRepository.getProfileCard(myId).then((profileCard: IUser) => {
                profileCard = profileCard['_doc'];
                delete profileCard.__v;
                resolve(<IProfileCard>profileCard)
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    controlUniquenessForEmail(email: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._userRepository.find({ email: email }, {}, {}).then((res) => {
                if (res.length > 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            }).catch((error) => {
                reject(error);
            })
        });
    }

}
