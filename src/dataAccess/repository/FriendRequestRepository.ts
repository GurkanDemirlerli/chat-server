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

}