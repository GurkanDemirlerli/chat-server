import { IRepositoryBase } from './IRepositoryBase';
import { IUser } from '../../../models';

export interface IUserRepository extends IRepositoryBase<IUser> {
    changeNotificationId(userId, notifyId);
    deleteNotificationId(userId): Promise<any>;
    searchUsers(name, limit, skip): Promise<IUser[]>;
    listMyFriends(myId: string): Promise<IUser>;
    getProfileCard(userId): Promise<IUser>;
}