import { IFriendShip, IFriendRequest } from "../../models";

export interface IFriendShipService {
    getReceivedFriendRequestsCount(myId: string): Promise<number>;
    getMyAllFriendShipRequests(myId: string): Promise<any[]>;
}