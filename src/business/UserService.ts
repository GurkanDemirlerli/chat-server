import 'reflect-metadata';
import { ISignupModel, ILoginModel, IUser, IFriendRequest, IFriendShip } from './../models';
import { injectable, inject } from 'inversify';
import { IOCTYPES } from '../ioc/ioc-types.enum';
import { IUserService } from 'src/business';
import { IUserRepository, IFriendRequestRepository, IFriendShipRepository } from './../dataAccess/repository';
import * as jwt from 'jsonwebtoken';
// import { AuthenticationService } from './';

@injectable()
export class UserService implements IUserService {

    constructor(
        @inject(IOCTYPES.USER_REPOSITORY) private _userRepository: IUserRepository,
        @inject(IOCTYPES.FRIENDREQUEST_REPOSITORY) private _friendRequestRepository: IFriendRequestRepository,
        @inject(IOCTYPES.FRIENDSHIP_REPOSITORY) private _friendShipRepository: IFriendShipRepository,
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



    sendFriendShipRequest(item): Promise<any> {
        return new Promise<any>((resolve, reject) => {
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

    acceptFriendShipRequest(friendRequestId: string, acceptorId: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this._friendRequestRepository.findById(friendRequestId).then((res) => {

                if (res.receiver.toString() == acceptorId) {
                    this._friendRequestRepository.acceptRequest(friendRequestId).then((res) => {
                        if (res) {
                            this.beFriends({ sender: res.sender, acceptor: res.receiver }).then((res) => {
                                if (res) {
                                    resolve('SUCCESS');
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

    rejectFriendShipRequest(friendRequestId: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this._friendRequestRepository.rejectRequest(friendRequestId).then((res) => {
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

    private beFriends(item): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this._friendShipRepository.create(item).then((res) => {
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

    listMyFriends(myId) {
        return new Promise<any>((resolve, reject) => {
            this._userRepository.listMyFriends(myId).then((res) => {
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

    searchUsers(name, limit, skip): Promise<any[]> {
        return new Promise<any>((resolve, reject) => {
            this._userRepository.searchUsers(name, limit, skip).then((res) => {
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



}

//========== TO DO =========
//  * Token üretimi AuthenticationService içinde olacak.