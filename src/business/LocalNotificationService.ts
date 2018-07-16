import { injectable, inject } from 'inversify';
import { IOCTYPES } from '../ioc/ioc-types.enum';
import {
    IUserRepository,
    IFriendShipRepository,
    IFriendRequestRepository,
    ILocalNotificationRepository
} from '../dataAccess/repository';
import { ILocalNotificationService } from './interfaces';
import {
    ILocalNotificationCreateModel,
    ILocalNotificationViewModel,
    ILocalNotification
} from '../models';
import {
    FriendshipRequestStatusTypes,
    LocalNotificationTypes
} from '../enums';
import 'reflect-metadata';
import { populateMongooseUserFields } from '../utils/PopulateMongooseUserFields';

@injectable()
export class LocalNotificationService implements ILocalNotificationService {

    constructor(
        @inject(IOCTYPES.USER_REPOSITORY) private readonly _userRepository: IUserRepository,
        @inject(IOCTYPES.FRIENDSHIP_REPOSITORY) private readonly _friendShipRepository: IFriendShipRepository,
        @inject(IOCTYPES.FRIENDREQUEST_REPOSITORY) private readonly _friendRequestRepository: IFriendRequestRepository,
        @inject(IOCTYPES.LOCALNOTIFICATION_REPOSITORY) private readonly _localNotificationRepository: ILocalNotificationRepository,
    ) { }

    createNotification(item: ILocalNotificationCreateModel): Promise<ILocalNotificationViewModel> {
        return new Promise<ILocalNotificationViewModel>((resolve, reject) => {
            this._localNotificationRepository.create(item).then((res: ILocalNotification) => {

                return this._localNotificationRepository.findOne({ _id: res._id }, {}, {
                    populate: {
                        path: 'from',
                        select: populateMongooseUserFields.forUserSummary
                    }
                });
            }).then((res: ILocalNotification) => {
                res = res['_doc'];
                delete res.__v;
                resolve(<ILocalNotificationViewModel>res);
            }).catch((error: Error) => {
                reject(error);
            });
        });
    }

    listNotifications(myId: string): Promise<ILocalNotificationViewModel[]> {
        return new Promise<ILocalNotificationViewModel[]>((resolve, reject) => {
            this._localNotificationRepository.find(
                { to: myId },
                {}, {
                    populate: {
                        path: 'from',
                        select: populateMongooseUserFields.forUserSummary
                    }
                }).then((res: ILocalNotification[]) => {
                    res = res.map(r => {
                        delete (r['_doc'] as ILocalNotification).__v;
                        return r['_doc']
                    });
                    resolve(<ILocalNotificationViewModel[]>res);
                }).catch((error: Error) => {
                    reject(error);
                })
        });
    }

    findUnreadedNotificationsCount(myId: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this._localNotificationRepository.findUnreadedNotificationsCount(myId).then((res: number) => {
                resolve(res);
            }).catch((error: Error) => {
                reject(error);
            })
        });

    }
    makeAllNotificationsReaded(myId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._localNotificationRepository.makeAllNotificationsReadedForOne(myId).then(() => {
                resolve();
            }).catch((error: Error) => {
                reject(error);
            })
        });
    }



}
