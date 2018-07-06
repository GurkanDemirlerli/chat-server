import { injectable, inject } from 'inversify';
import { IOCTYPES } from '../ioc/ioc-types.enum';
import { IUserRepository, IFriendShipRepository, IFriendRequestRepository } from './../dataAccess/repository';
import { IFriendShipService } from './interfaces';
import 'reflect-metadata';
import { IFriendRequest, IUser } from '../models';

@injectable()
export class FriendShipService implements IFriendShipService {

    constructor(
        @inject(IOCTYPES.USER_REPOSITORY) private _userRepository: IUserRepository,
        @inject(IOCTYPES.FRIENDSHIP_REPOSITORY) private _friendShipRepository: IFriendShipRepository,
        @inject(IOCTYPES.FRIENDREQUEST_REPOSITORY) private _friendRequestRepository: IFriendRequestRepository
    ) { }
    getReceivedFriendRequestsCount(myId: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this._friendRequestRepository.getReceivedFriendRequestsCount(myId).then((res) => {
                resolve(res);
            }).catch((error) => {
                reject(error);
            });
        });
    }

    getMyAllFriendShipRequests(myId: string): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            this._friendRequestRepository.getAllFriendShipRequestsForUser(myId).then((res) => {
                let requests = [];
                let iterator = 0;
                if (res.length < 1) {
                    resolve(res);
                }
                res.forEach(request => {
                    let isSelfRequest;
                    if ((request.sender as IUser)._id == myId) {
                        isSelfRequest = true;
                    } else {
                        isSelfRequest = false;
                    }
                    requests.push({
                        _id: request._id,
                        sender: request.sender,
                        receiver: request.receiver,
                        requestTime: request.requestTime,
                        requestMessage: request.requestMessage,
                        status: request.status,
                        isSelfRequest: isSelfRequest
                    });
                    iterator++;
                    if (iterator == res.length) {
                        resolve(requests);
                    }
                });

            }).catch((error) => {
                reject(error);
            });
        });
    }
}
