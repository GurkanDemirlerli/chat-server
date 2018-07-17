import * as express from 'express';
import { AuthenticationService } from '../../business';
import { injectable } from 'inversify';
import { ErrorHandler } from '../../errors/ErrorHandler';
import 'reflect-metadata';


@injectable()
export class AuthController {

    constructor(
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
}