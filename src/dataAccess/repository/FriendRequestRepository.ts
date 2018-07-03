import { injectable } from 'inversify';
import FriendRequestSchema = require("./../schemas/friendrequest.schema");
import { IFriendRequestRepository } from './interfaces/IFriendRequestRepository';
import { RepositoryBase } from './RepositoryBase';
import { IFriendRequest } from './../../models';
import 'reflect-metadata';

@injectable()
export class FriendRequestRepository extends RepositoryBase<IFriendRequest> implements IFriendRequestRepository {
    constructor() {
        super(FriendRequestSchema)
    }

    acceptRequest(friendRequestId: string): Promise<any> {
        let p = new Promise<IFriendRequest>((resolve, reject) => {
            FriendRequestSchema
                .findByIdAndUpdate(friendRequestId, { status: 1 })
                .exec((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });
        return p;
    }

    rejectRequest(friendRequestId: string): Promise<any> {
        let p = new Promise<IFriendRequest>((resolve, reject) => {
            FriendRequestSchema
                .findByIdAndUpdate(friendRequestId, { status: 2 })
                .exec((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });
        return p;
    }

    cancelRequest(friendRequestId: string): Promise<any> {
        let p = new Promise<IFriendRequest>((resolve, reject) => {
            FriendRequestSchema
                .findByIdAndUpdate(friendRequestId, { status: 3 })
                .exec((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });
        return p;
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

}