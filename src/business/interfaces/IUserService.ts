import { ISignupModel, ILoginModel, IUser, IFriendRequest, IFriendShip } from '../../models';

export interface IUserService {
    signup: (item: ISignupModel) => Promise<IUser>;
    login: (item: ILoginModel) => Promise<any>;
    changeNotificationId(userId, notifyId): Promise<any>;
    deleteNotificationId(userId): Promise<any>;
    sendFriendShipRequest(item): Promise<IFriendRequest>;
    acceptFriendShipRequest(friendRequestId: string, acceptorId: string): Promise<IFriendShip>;
    rejectFriendShipRequest(friendRequestId: string): Promise<IFriendRequest>;
    listMyFriends(myId: string):Promise<any[]>;
    searchUsers(name, limit, skip):Promise<IUser[]>
}