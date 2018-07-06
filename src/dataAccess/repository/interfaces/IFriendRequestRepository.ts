import { IRepositoryBase } from './IRepositoryBase';
import { IFriendRequest } from './../../../models';

export interface IFriendRequestRepository extends IRepositoryBase<IFriendRequest> {
    acceptRequest(friendRequestId: string): Promise<any>;
    rejectRequest(friendRequestId: string): Promise<any>;
    cancelRequest(friendRequestId: string): Promise<any>;
    gidenArkadaslikIstegiVarmi(myId, otherId): Promise<String>;
    gelenArkadaslikIstegiVarmi(myId, otherId): Promise<String>;
    getReceivedFriendRequestsCount(userId: string): Promise<number> ;
    getAllFriendShipRequestsForUser(userId: string): Promise<IFriendRequest[]>
}