import {
    FriendshipRequestCreateModel,
    IFriendshipRequestViewModel,
    IFriendshipViewModel,
    ISendedFriendshipRequest,
    IReceivedFriendshipRequest,
    IFriendViewModel,
} from "../../models";

export interface IFriendShipService {
    getReceivedRequestCount(myId: string): Promise<number>;
    listSendedRequestsForUser(myId: string): Promise<ISendedFriendshipRequest[]>;
    listReceivedRequestsForUser(myId: string): Promise<IReceivedFriendshipRequest[]>;
    sendFriendshipRequest(item: FriendshipRequestCreateModel): Promise<IFriendshipRequestViewModel>;
    acceptFriendshipRequest(friendshipRequestId: string, acceptorId: string): Promise<IFriendshipViewModel>;
    rejectFriendshipRequest(friendshipRequestId: string, rejectorId: string): Promise<IFriendshipRequestViewModel>;
    cancelFriendshipRequest(friendshipRequestId: string, cancellerId: string): Promise<IFriendshipRequestViewModel>;
    removeFriendship(friendshipId: string, userId: string): Promise<string>;
    listFriends(userId: string): Promise<IFriendViewModel[]>;
    getFriendIds(userId: string): Promise<string[]>;
    findMyFriend(myId: string, friendId: string): Promise<IFriendViewModel>;
}