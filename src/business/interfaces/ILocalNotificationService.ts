import { ILocalNotificationCreateModel, ILocalNotificationViewModel } from "../../models";

export interface ILocalNotificationService {
    createNotification(item: ILocalNotificationCreateModel): Promise<ILocalNotificationViewModel>;
    listNotifications(myId: string): Promise<ILocalNotificationViewModel[]>;
    findUnreadedNotificationsCount(myId: string): Promise<number>;
    makeAllNotificationsReaded(myId: string): Promise<void>;
}