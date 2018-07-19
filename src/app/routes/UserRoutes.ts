import { UsersController } from '../controllers';
import * as express from 'express';
import { Container } from 'inversify';
import { AuthenticationService } from '../../business';

export class UserRoutes {
    public static configureRoutes(app: express.Application, container: Container): void {
        const root = "/api/users";
        const usersController = container.get(UsersController);

        app.route(root + '/signup')
            .post((req, res, next) => usersController.signup(req, res, next));

        app.route(root + '/login')
            .post((req, res, next) => usersController.login(req, res, next));

        app.route(root + '/changeNotificationId')
            .post((req, res, next) => usersController.changeNotificationId(req, res, next));

        app.route(root + '/deleteNotificationId')
            .post((req, res, next) => usersController.deleteNotificationId(req, res, next));

        app.route(root + '/getMyProfileCard')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => usersController.getMyProfileCard(req, res, next));

        app.route(root + '/searchUsersByUsername')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => usersController.searchUsersByUsername(req, res, next));

        app.route(root + '/controlUniquenessForEmail/:email')
            .get((req, res, next) => usersController.controlUniquenessForEmail(req, res, next));



    }
}