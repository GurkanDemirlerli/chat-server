import { injectable } from 'inversify';
import LocalNotificationSchema = require("./../schemas/local-notification.schema");
import { ILocalNotificationRepository } from './interfaces/ILocalNotificationRepository';
import { RepositoryBase } from './RepositoryBase';
import { ILocalNotification } from './../../models';
import 'reflect-metadata';

@injectable()
export class LocalNotificationRepository extends RepositoryBase<ILocalNotification> implements ILocalNotificationRepository {
    constructor() {
        super(LocalNotificationSchema)
    }
    findNotificationsForOne(userId: String): Promise<ILocalNotification[]> {
        return new Promise<ILocalNotification[]>((resolve, reject) => {
            LocalNotificationSchema
                .find({ to: userId })
                .populate('from', '_id name email')
                .exec((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });
    }
    findUnreadedNotificationsCount(userId: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            LocalNotificationSchema
                .find({ to: userId, isRead: false })
                .count()
                .exec((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });
    }

}