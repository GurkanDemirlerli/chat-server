import { ISignupModel, ILoginModel, IUser, IFriendRequest } from '../../models';

export interface IUserService {
    signup: (item: ISignupModel) => Promise<IUser>;
    login: (item: ILoginModel) => Promise<any>;
    changeNotificationId(userId, notifyId): Promise<any>;
    deleteNotificationId(userId): Promise<any>;
    sendFriendShipRequest(item): Promise<any>;
    acceptFriendShipRequest(friendRequestId: string, acceptorId: string): Promise<any>;
    rejectFriendShipRequest(friendRequestId: string): Promise<any>;
}