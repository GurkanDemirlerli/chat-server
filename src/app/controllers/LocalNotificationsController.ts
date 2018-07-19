import * as express from 'express';
import {
    AuthenticationService,
    ILocalNotificationService
} from '../../business';
import { injectable, inject } from 'inversify';
import { IOCTYPES } from '../../ioc/ioc-types.enum';
import { ErrorHandler } from '../../errors/ErrorHandler';
import { ILocalNotificationViewModel } from '../../models';
import 'reflect-metadata';

@injectable()
export class LocalNotificationsController {

    constructor(
        @inject(IOCTYPES.LOCAL_NOTIFICATION_SERVICE) private _localNotificationService: ILocalNotificationService,

    ) { }

    public list(req: express.Request, res: express.Response, next: express.NextFunction) {
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            return this._localNotificationService.listNotifications(decodedToken._id);
        }).then((data: ILocalNotificationViewModel[]) => {
            return res.status(200).json({
                success: true,
                data: data
            });
        }).catch((error: Error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'list', 'LocalNotificationsController');
        });
    }

    public unreadedCount(req: express.Request, res: express.Response, next: express.NextFunction) {
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            return this._localNotificationService.findUnreadedNotificationsCount(decodedToken._id);
        }).then((data: number) => {
            return res.status(200).json({
                success: true,
                data: data
            });
        }).catch((error: Error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'unreadedCount', 'LocalNotificationsController');
        });
    }

    public makeAllReaded(req: express.Request, res: express.Response, next: express.NextFunction) {
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            return this._localNotificationService.makeAllNotificationsReaded(decodedToken._id);
        }).then(() => {
            return res.status(200).json({
                success: true,
            });
        }).catch((error: Error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'makeAllReaded', 'LocalNotificationsController');
        });
    }
}
