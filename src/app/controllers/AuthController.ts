import * as express from 'express';
import { AuthenticationService, IUserService } from '../../business';
import { injectable, inject } from 'inversify';
import { ErrorHandler } from '../../errors/ErrorHandler';
import 'reflect-metadata';
import { IOCTYPES } from '../../ioc';


@injectable()
export class AuthController {

    constructor(
        @inject(IOCTYPES.USER_SERVICE) private _userService: IUserService,

    ) { }

    isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
        let isAuth;
        AuthenticationService.isAuthenticated(req).then((data) => {
            isAuth = data;
            return this.wait();
        }).then(() => {
            if (isAuth) {
                return res.status(200).json({
                    success: true,
                    data: {
                        isAuth: true
                    }
                });
            } else {
                return res.status(200).json({
                    success: true,
                    data: {
                        isAuth: false
                    }
                });
            }
        }).catch((error: Error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'isAuthenticated', 'AuthController');
        });
    }

    private wait() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('2 seconds Timer expired!!!');
                resolve();
            }, 2000)
        });
    }

    test(req: express.Request, res: express.Response, next: express.NextFunction) {
        AuthenticationService.decodeToken(req).then((decodedToken) => {
          return this._userService.test(decodedToken._id);
        }).then((data) => {
            return res.json({
                'success': true,
                'data': data
            });
        }).catch((error: Error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'test', 'AuthController');
        });
    }
}