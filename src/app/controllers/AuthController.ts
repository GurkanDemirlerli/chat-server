import * as express from 'express';
import { AuthenticationService, IUserService } from '../../business';
import { injectable, inject } from 'inversify';
import { ErrorHandler } from '../../errors/ErrorHandler';
import { IOCTYPES } from '../../ioc';
import { SignupInput, LoginInput, ILoginResult, IProfileCard } from '../../models';
import { validate } from 'class-validator';
import { AppError } from '../../errors/AppError';
import 'reflect-metadata';


@injectable()
export class AuthController {

    constructor(
        @inject(IOCTYPES.USER_SERVICE) private _userService: IUserService,

    ) { }

    public signup(req: express.Request, res: express.Response, next: express.NextFunction) {
        console.log(req.body);
        let signupInput: SignupInput = new SignupInput(
            req.body.email,
            req.body.username,
            req.body.firstname,
            req.body.lastname,
            req.body.password
        );
        console.log(signupInput);
        validate(signupInput, { skipMissingProperties: true }).then((errors) => {
            if (errors.length > 0) {
                throw new AppError(
                    'Validation Error',
                    JSON.stringify(errors),
                    400
                )
            }
            return this._userService.signup(signupInput);
        }).then(() => {
            return res.status(201).json({
                success: true,
            });
        }).catch((error: Error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'signup', 'AuthController');
        });
    }

    public login(req: express.Request, res: express.Response, next: express.NextFunction) {
        let loginInput: LoginInput = new LoginInput(
            req.body.email,
            req.body.password
        );
        validate(loginInput).then((errors) => {
            if (errors.length > 0) {
                let error = new Error(JSON.stringify(errors));
                error.name = 'Validation Error';
                throw error;
            }
            return this._userService.login(loginInput);
        }).then((data: ILoginResult) => {
            return res.status(200).json({
                'success': true,
                'data': data
            });
        }).catch((error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'login', 'AuthController');
        });
    }


    public isAuthenticated(req: express.Request, res: express.Response, next: express.NextFunction) {
        let isAuth;
        AuthenticationService.isAuthenticated(req).then((data) => {
            isAuth = data;
            // return this.wait();
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

    // controlUniquenessForUsername Ekle
    public controlUniquenessForEmail(req: express.Request, res: express.Response, next: express.NextFunction) {
        const email = req.params.email;
        this._userService.controlUniquenessForEmail(email).then((data) => {
            return res.json({
                'success': true,
                'data': data
            });
        }).catch((error: Error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'controlUniquenessForEmail', 'AuthController');
        });
    }
    
    getMyProfileCard(req: express.Request, res: express.Response, next: express.NextFunction) {
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            return this._userService.getMyProfileCard(decodedToken._id);
        }).then((data: IProfileCard) => {
            return res.json({
                'success': true,
                'data': data
            });
        }).catch((error: Error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'getMyProfileCard', 'UsersController');
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