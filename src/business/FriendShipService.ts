import { AppError } from '../errors/AppError';
import { injectable, inject } from 'inversify';
import { IOCTYPES } from '../ioc/ioc-types.enum';
import {
    IFriendShipRepository,
    IFriendRequestRepository,
    IMessageRepository,
    IUserRepository,
} from '../dataAccess/repository';
import { IFriendShipService } from './interfaces';
import {
    IFriendshipRequestViewModel,
    FriendshipRequestCreateModel,
    IFriendRequest,
    IFriendShip,
    IFriendshipViewModel,
    ISendedFriendshipRequest,
    IReceivedFriendshipRequest,
    IFriendViewModel,
    IUser
} from '../models';
import {
    FriendshipRequestStatusTypes as FRST,
} from '../enums';
import 'reflect-metadata';
import { populateMongooseUserFields } from '../utils';


@injectable()
export class FriendShipService implements IFriendShipService {

    constructor(

        @inject(IOCTYPES.MESSAGE_REPOSITORY) private readonly _messageRepository: IMessageRepository,
        @inject(IOCTYPES.FRIENDSHIP_REPOSITORY) private readonly _friendShipRepository: IFriendShipRepository,
        @inject(IOCTYPES.FRIENDREQUEST_REPOSITORY) private readonly _friendRequestRepository: IFriendRequestRepository,
        @inject(IOCTYPES.USER_REPOSITORY) private _userRepository: IUserRepository,
    ) { }

    public getReceivedRequestCount(myId: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this._friendRequestRepository.count({ receiver: myId, status: FRST.WAITING }).then((res) => {
                resolve(res);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    public listSendedRequestsForUser(myId: string): Promise<ISendedFriendshipRequest[]> {
        return new Promise<ISendedFriendshipRequest[]>((resolve, reject) => {
            this._friendRequestRepository
                .find({ sender: myId, status: FRST.WAITING },
                    {
                    }, {
                        populate: {
                            path: 'receiver',
                            select: populateMongooseUserFields.forUserSummary
                        }
                    })
                .then((res: IFriendRequest[]) => {
                    res = res.map(r => {
                        delete (r['_doc'] as IFriendRequest).__v;
                        return r['_doc'];
                    });
                    resolve(<ISendedFriendshipRequest[]>res);
                }).catch((error: Error) => {
                    reject(error);
                });
        });
    }

    public listReceivedRequestsForUser(myId: string): Promise<IReceivedFriendshipRequest[]> {
        return new Promise<IReceivedFriendshipRequest[]>((resolve, reject) => {
            this._friendRequestRepository
                .find({ receiver: myId, status: FRST.WAITING },
                    {
                        receiver: 0
                    }, {
                        populate: {
                            path: 'sender',
                            select: populateMongooseUserFields.forUserSummary
                        }
                    })
                .then((res: IFriendRequest[]) => {
                    res = res.map(r => {
                        delete (r['_doc'] as IFriendRequest).__v;
                        return r['_doc']
                    });
                    resolve(<IReceivedFriendshipRequest[]>res);
                }).catch((error: Error) => {
                    reject(error);
                });
        });
    }

    public sendFriendshipRequest(item: FriendshipRequestCreateModel): Promise<IFriendshipRequestViewModel> {
        return new Promise<IFriendshipRequestViewModel>((resolve, reject) => {
            this._friendShipRepository.arkadaslikKontrol(item.sender, item.receiver).then((arkadaslarMi) => {
                if (arkadaslarMi)
                    throw new AppError(
                        'AppError',
                        'Zaten Arkadaşsınız.',
                        400
                    );
                return this._friendRequestRepository.findOne({
                    sender: item.sender,
                    receiver: item.receiver,
                    status: FRST.WAITING
                }, {}, {});
            }).then((gidenIstekVarMi) => {
                if (gidenIstekVarMi)
                    throw new AppError(
                        'AppError',
                        'Zaten Bir Arkadaşlık İsteği daha önce gönderildi.',
                        400
                    );
                return this._friendRequestRepository.findOne({
                    sender: item.receiver,
                    receiver: item.sender,
                    status: FRST.WAITING
                }, {}, {})
            }).then((gelenIstekVar) => {
                if (gelenIstekVar)
                    throw new AppError(
                        'AppError',
                        'Zaten karşıdaki kullanıcı daha önce arkadaşlık isteği göndermiş.',
                        400
                    );
                return this._friendRequestRepository.create(item);
            }).then(async (res: IFriendRequest) => {
                return this._friendRequestRepository.findOne(
                    { _id: res._id },
                    {},
                    {
                        populate: [{
                            path: 'sender',
                            select: populateMongooseUserFields.forUserSummary
                        }, {
                            path: 'receiver',
                            select: populateMongooseUserFields.forUserSummary
                        }]
                    });
            }).then((res: IFriendRequest) => {
                res = res['_doc'];
                delete res.__v;
                resolve(<IFriendshipRequestViewModel>res);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    public acceptFriendshipRequest(friendshipRequestId: string, acceptorId: string): Promise<IFriendshipViewModel> {
        return new Promise<IFriendshipViewModel>((resolve, reject) => {
            this.validateAndUpdateFriendshipRequest(
                friendshipRequestId,
                acceptorId,
                FRST.ACCEPTED
            ).then((res: IFriendshipRequestViewModel) => {
                return this._friendShipRepository.create({ sender: res.sender._id, acceptor: res.receiver._id });
            }).then((res: IFriendShip) => {
                return this._friendShipRepository.findOne(
                    { _id: res._id },
                    {},
                    {
                        populate: [{
                            path: 'sender',
                            select: populateMongooseUserFields.forUserDetails
                        }, {
                            path: 'acceptor',
                            select: populateMongooseUserFields.forUserDetails
                        }]
                    });
            }).then((res: IFriendShip) => {
                res = res['_doc'];
                delete res.__v;
                resolve(<IFriendshipViewModel>res);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    public rejectFriendshipRequest(friendshipRequestId: string, rejectorId: string): Promise<IFriendshipRequestViewModel> {
        return new Promise<IFriendshipRequestViewModel>((resolve, reject) => {
            this.validateAndUpdateFriendshipRequest(
                friendshipRequestId,
                rejectorId,
                FRST.REJECTED
            ).then((res: IFriendshipRequestViewModel) => {
                resolve(<IFriendshipRequestViewModel>res);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    public cancelFriendshipRequest(friendshipRequestId: string, cancellerId: string): Promise<IFriendshipRequestViewModel> {
        return new Promise<any>((resolve, reject) => {
            this.validateAndUpdateFriendshipRequest(
                friendshipRequestId,
                cancellerId,
                FRST.CANCELLED
            ).then((res: IFriendshipRequestViewModel) => {
                resolve(<IFriendshipRequestViewModel>res);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    private validateAndUpdateFriendshipRequest(friendshipRequestId: string, userId: string, type: number): Promise<IFriendshipRequestViewModel> {
        return new Promise<IFriendshipRequestViewModel>((resolve, reject) => {
            this._friendRequestRepository.findById(friendshipRequestId).then((res) => {
                if (!res)
                    throw new AppError(
                        'AppError',
                        'Böyle bir arkadaşlık isteği yok',
                        404
                    );
                let authorizedUser;
                if (type === FRST.CANCELLED)
                    authorizedUser = res.sender.toString();
                else
                    authorizedUser = res.receiver.toString();
                if (authorizedUser !== userId)
                    throw new AppError(
                        'AppError',
                        'Başkalarına giden arkadaşlık istekleri üzerince işlem yapamazsınız.',
                        403
                    );
                if (res.status !== FRST.WAITING)
                    throw new AppError(
                        'AppError',
                        'Zaten bu istek için daha önce bir işlem yapılmış.',
                        403
                    );
                return this._friendRequestRepository.updateStatus(friendshipRequestId, type);
            }).then((res: IFriendRequest) => {
                return this._friendRequestRepository.findOne(
                    { _id: res._id },
                    {},
                    {
                        populate: [{
                            path: 'sender',
                            select:populateMongooseUserFields.forUserSummary
                        }, {
                            path: 'receiver',
                            select:populateMongooseUserFields.forUserSummary
                        }]
                    });
            }).then((res: IFriendRequest) => {
                res = res['_doc'];
                delete res.__v;
                resolve(<IFriendshipRequestViewModel>res);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    public removeFriendship(friendshipId: string, userId: string): Promise<string> {
        let removedFriend: string;
        return new Promise<string>((resolve, reject) => {
            this._friendShipRepository.findById(friendshipId).then((res: IFriendShip) => {
                if (!res)
                    throw new AppError(
                        'AppError',
                        'Böyle bir arkadaşlık yok',
                        404
                    );
                if ((res.acceptor.toString() !== userId) || (res.sender.toString() !== userId)) {
                    if (res.acceptor.toString() !== userId)
                        removedFriend = res.sender.toString();
                    else
                        removedFriend = res.acceptor.toString();
                } else
                    throw new AppError(
                        'AppError',
                        'Başkalarının arkadaşlığını silemezsiniz.',
                        403
                    );
                return this._friendShipRepository.delete(friendshipId);
            }).then(() => {
                resolve(<string>removedFriend);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    listFriends(userId: string): Promise<IFriendViewModel[]> {
        return new Promise<IFriendViewModel[]>((resolve, reject) => {
            this._friendShipRepository
                .find({ $or: [{ sender: userId }, { acceptor: userId }] },
                    {},
                    {
                        populate: [{
                            path: 'sender',
                            select: populateMongooseUserFields.forUserDetails
                        }, {
                            path: 'acceptor',
                            select: populateMongooseUserFields.forUserDetails
                        }, {
                            path: 'chat',
                            match: { to: userId, isRead: false },
                            select: '_id'
                        }]
                    })
                .then((res: IFriendShip[]) => {
                    let result = res.map(async (r: any) => {
                        let friend: IFriendViewModel;
                        if (r.sender._id.toString() === userId) {
                            friend = r['_doc'].acceptor['_doc'];
                        }
                        else {
                            friend = r['_doc'].sender['_doc'];
                        }
                        friend.unReadedMessagesCount = r.chat.length;
                        friend.friendshipId = r['_doc']._id;
                        return friend;
                    });
                    Promise.all(result).then((results) => {
                        resolve(<IFriendViewModel[]>results);
                    });
                }).catch((error: Error) => {
                    reject(error);
                });
        });
    }

    findMyFriend(myId: string, friendId: string): Promise<IFriendViewModel> {
        let friend: any;
        return new Promise<IFriendViewModel>((resolve, reject) => {
            this._friendShipRepository.arkadaslikKontrol(myId, friendId).then((arkadaslarMı: boolean) => {
                if (!arkadaslarMı)
                    throw new AppError(
                        'AppError',
                        'Arkadaş Değilsiniz.',
                        403
                    );
                return this._userRepository.findOne({ _id: friendId },
                    {
                        _id: 1,
                        username: 1,
                        firstname: 1,
                        lastname: 1
                    },
                    {});
            }).then((res: IUser) => {
                friend = res['_doc'];
                delete friend.__v;
                return this._messageRepository.findUnreadedMessagesCount(myId, friendId);
            }).then((res: number) => {
                friend.unReadedMessagesCount = res;
                resolve(<IFriendViewModel>friend);
            }).catch((error) => {
                reject(error);
            });

        });
    }
}
