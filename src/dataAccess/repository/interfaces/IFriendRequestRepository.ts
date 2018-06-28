import { IRepositoryBase } from './IRepositoryBase';
import { IFriendRequest } from './../../../models';

export interface IFriendRequestRepository extends IRepositoryBase<IFriendRequest> {
    acceptRequest(friendRequestId: string): Promise<any>;
    rejectRequest(friendRequestId: string): Promise<any>;
}