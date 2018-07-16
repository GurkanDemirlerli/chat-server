import { IRepositoryBase } from './IRepositoryBase';
import { IFriendRequest } from '../../../models';

export interface IFriendRequestRepository extends IRepositoryBase<IFriendRequest> {
    updateStatus(friendshipRequestId: string, status: number): Promise<IFriendRequest>;
    gidenArkadaslikIstegiVarmi(myId, otherId): Promise<String>;
    gelenArkadaslikIstegiVarmi(myId, otherId): Promise<String>;
    getReceivedFriendRequestsCount(userId: string): Promise<number> ;
    // getSendedFriendShipRequestsForUser(userId: string): Promise<IFriendRequest[]>;
    // getReceivedFriendShipRequestsForUser(userId: string): Promise<IFriendRequest[]>;
}