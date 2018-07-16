import * as express from 'express';
import { IUserService, IMessageService, AuthenticationService } from '../../business';
import { injectable, inject } from 'inversify';
import { IOCTYPES } from '../../ioc/ioc-types.enum';
import {
    ILoginResult,
    SignupInput,
    LoginInput,
    IProfileCard,
    IUserSearchResult
} from '../../models';
import { validate } from 'class-validator';
import { onlineUsers } from '../../socket/online-users';
import { AppError } from '../../errors/AppError';
import { ErrorHandler } from '../../errors/ErrorHandler';
import 'reflect-metadata';


@injectable()
export class UsersController {

    constructor(
        @inject(IOCTYPES.USER_SERVICE) private _userService: IUserService,
        @inject(IOCTYPES.MESSAGE_SERVICE) private _messageService: IMessageService
    ) { }

    signup(req: express.Request, res: express.Response, next: express.NextFunction) {
        let signupInput: SignupInput = new SignupInput(
            req.body.email,
            req.body.username,
            req.body.firstname,
            req.body.lastname,
            req.body.password
        );
        validate(signupInput).then((errors) => {
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
            return ErrorHandler.handleErrorResponses(error, res, 'signup', 'UsersController');
        });
    }

    login(req: express.Request, res: express.Response, next: express.NextFunction) {
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
            return ErrorHandler.handleErrorResponses(error, res, 'login', 'UsersController');
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

    controlUniquenessForEmail(req: express.Request, res: express.Response, next: express.NextFunction) {
        const email = req.params.email;
        this._userService.controlUniquenessForEmail(email).then((data) => {
            return res.json({
                'success': true,
                'data': data
            });
        }).catch((error: Error) => {
            return ErrorHandler.handleErrorResponses(error, res, 'controlUniquenessForEmail', 'UsersController');
        });
    }

    // controlUniquenessForUsername Ekle

    searchUsersByUsername(req: express.Request, res: express.Response, next: express.NextFunction) {
        AuthenticationService.decodeToken(req).then((decodedToken) => {
            const username = req.query.username;
            const limit = req.query.limit;
            const skip = req.query.skip;
            //TO DO model yap validation yap
            return this._userService.searchUsers(username, limit, skip, decodedToken._id);
        }).then((data: IUserSearchResult[]) => {
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
}