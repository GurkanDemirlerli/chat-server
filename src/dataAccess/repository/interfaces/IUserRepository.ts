import { IRepositoryBase } from './IRepositoryBase';
import { IUser } from '../../../models';

export interface IUserRepository extends IRepositoryBase<IUser> {
    changeNotificationId(userId, notifyId);
    deleteNotificationId(userId): Promise<any>;
    searchUsers(username: string, limit: number, skip: number): Promise<IUser[]>;
    listMyFriends(myId: string): Promise<IUser>;
    getProfileCard(userId): Promise<IUser>;
}