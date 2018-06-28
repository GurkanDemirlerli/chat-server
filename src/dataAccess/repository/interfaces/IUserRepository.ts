import { IRepositoryBase } from './IRepositoryBase';
import { IUser } from './../../../models';

export interface IUserRepository extends IRepositoryBase<IUser> {
    changeNotificationId(userId, notifyId);
    deleteNotificationId(userId): Promise<any>;
    searchUsers(name, limit, skip): Promise<any[]>;
    listMyFriends(myId): Promise<IUser[]>;
}