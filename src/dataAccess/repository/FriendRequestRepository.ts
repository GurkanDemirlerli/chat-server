import { injectable } from 'inversify';
import FriendRequestSchema = require("../schemas/friendrequest.schema");
import { IFriendRequestRepository } from './interfaces/IFriendRequestRepository';
import { RepositoryBase } from './RepositoryBase';
import { IFriendRequest } from '../../models';
import 'reflect-metadata';

@injectable()
export class FriendRequestRepository extends RepositoryBase<IFriendRequest> implements IFriendRequestRepository {
    constructor() {
        super(FriendRequestSchema)
    }

    updateStatus(friendshipRequestId: string, status: number): Promise<IFriendRequest> {
        return new Promise((resolve, reject) => {
            FriendRequestSchema
                .findByIdAndUpdate(friendshipRequestId, { status: status })
                .exec((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });
    }

    gidenArkadaslikIstegiVarmi(myId, otherId): Promise<String> {
        let p = new Promise<String>((resolve, reject) => {
            FriendRequestSchema
                .findOne({
                    sender: myId,
                    receiver: otherId,
                    status: 0
                })
                .select('_id')
                .exec((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (res) {
                            resolve(res._id.toString());
                        } else {
                            reject("");
                        }
                    }
                });
        });
        return p;
    }

    gelenArkadaslikIstegiVarmi(myId, otherId): Promise<String> {
        let p = new Promise<String>((resolve, reject) => {
            FriendRequestSchema
                .findOne({
                    sender: otherId,
                    receiver: myId,
                    status: 0
                })
                .select('_id')
                .exec((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (res) {
                            resolve(res._id.toString());
                        } else {
                            reject("");
                        }
                    }
                });
        });
        return p;
    }

    getReceivedFriendRequestsCount(userId: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            FriendRequestSchema
                .find({ receiver: userId, status: 0 })
                .count()
                .exec((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });
    }

    getAllFriendShipRequestsForUser(userId: string): Promise<IFriendRequest[]> {
        return new Promise<IFriendRequest[]>((resolve, reject) => {
            FriendRequestSchema
                .find({})
                .or([{
                    receiver: userId,
                    status: 0
                }, {
                    sender: userId,
                    status: 0
                }
                ])
                .populate('receiver', '_id firstname lastname username')
                .populate('sender', '_id firstname lastname username')
                .exec((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });
    }

    // getSendedFriendShipRequestsForUser(userId: string): Promise<IFriendRequest[]> {
    //     return new Promise<IFriendRequest[]>((resolve, reject) => {
    //         FriendRequestSchema
    //             .find({})
    //                 receiver: userId,
    //                 status: 0
    //             }, {
    //                 sender: userId,
    //                 status: 0
    //             }
    //             .populate('receiver', '_id firstname lastname username')
    //             .populate('sender', '_id firstname lastname username')
    //             .exec((err, res) => {
    //                 if (err) {
    //                     reject(err);
    //                 } else {
    //                     resolve(res);
    //                 }
    //             });
    //     });
    // }
    // getReceivedFriendShipRequestsForUser(userId: string): Promise<IFriendRequest[]> {
    //     throw new Error("Method not implemented.");
    // }

}