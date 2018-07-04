import {
    ISignupModel,
    ILoginModel,
    IUser,
    IFriendRequest,
    IFriendShip,
    IUserSearchResultModel,
    ILocalNotification
} from '../../models';

export interface IUserService {
    signup: (item: ISignupModel) => Promise<IUser>;
    login: (item: ILoginModel) => Promise<any>;
    changeNotificationId(userId, notifyId): Promise<any>;
    deleteNotificationId(userId): Promise<any>;
    sendFriendShipRequest(item): Promise<IFriendRequest>;
    acceptFriendShipRequest(friendRequestId: string, acceptorId: string): Promise<IFriendShip>;
    rejectFriendShipRequest(friendRequestId: string, rejectorId: string): Promise<IFriendRequest>;
    cancelSendedFriendShipRequest(friendRequestId: string, iptalEden: string): Promise<IFriendRequest>;
    listMyFriends(myId: string): Promise<any[]>;
    searchUsers(name, limit, skip, myId): Promise<IUserSearchResultModel[]>
    findMyFriend(myId, friendId): Promise<IUser>;
    getMyProfileCard(myId): Promise<IUser>;
    getMyNotifications(myId: string): Promise<ILocalNotification[]>;
}