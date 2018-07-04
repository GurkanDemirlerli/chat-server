import { IRepositoryBase } from './IRepositoryBase';
import { ILocalNotification } from './../../../models';

export interface ILocalNotificationRepository extends IRepositoryBase<ILocalNotification> {
    findNotificationsForOne(userId: String): Promise<ILocalNotification[]>;
    findUnreadedNotificationsCount(userId: string): Promise<number>;
}