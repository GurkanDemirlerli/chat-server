import * as express from 'express';
import { IUserService, IMessageService, AuthenticationService } from '../../business';
import { injectable, inject } from 'inversify';
import { IOCTYPES } from '../../ioc/ioc-types.enum';
import {
    IUserSearchResultModel
} from '../../models';
import { ErrorHandler } from '../../errors/ErrorHandler';
import 'reflect-metadata';
import { onlineUsers } from '../../socket/online-users';


@injectable()
export class UsersController {

    constructor(
        @inject(IOCTYPES.USER_SERVICE) private _userService: IUserService
    ) { }

    searchUsersByUsername(req: express.Request, res: express.Response, next: express.NextFunction) {
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            const username = req.query.username;
            const limit = req.query.limit;
            const skip = req.query.skip;
            //TO DO model yap validation yap
            return this._userService.searchUsers(username, parseInt(limit), parseInt(skip), decodedToken._id);
        }).then((data: IUserSearchResultModel[]) => {
            console.log(data);
            return res.status(200).json({
                'success': true,
                'data': data
            });
        }).catch((error: Error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'searchUsersByUsername', 'UsersController');
        });
    }

    //ionic icin gerekli
    changeNotificationId(req: express.Request, res: express.Response, next: express.NextFunction) {
        this._userService.changeNotificationId(req.body.userId, req.body.notificationId).then((data) => {
            return res.json({
                'success': true,
                'data': data
            });
        }).catch((error) => {
            return res.json({
                'success': false,
                'error': error
            });
        });
    }

    //ionic icin gerekli
    deleteNotificationId(req: express.Request, res: express.Response, next: express.NextFunction) {
        this._userService.deleteNotificationId(req.body.userId).then((data) => {
            return res.json({
                'success': true,
                'data': data
            });
        }).catch((error) => {
            return res.json({
                'success': false,
                'error': error
            });
        });
    }

    test(req, res, next) {
        return res.json({
            onlineUsers
        })
    }
}