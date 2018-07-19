import { AuthController } from '../controllers';
import * as express from 'express';
import { Container } from 'inversify';
import { AuthenticationService } from '../../business';

export class AuthRoutes {
    public static configureRoutes(app: express.Application, container: Container): void {
        const root = "/api/auth";
        const authController = container.get(AuthController);

        app.route(root + '/signup')
            .post((req, res, next) => authController.signup(req, res, next));

        app.route(root + '/login')
            .post((req, res, next) => authController.login(req, res, next));

        app.route(root + '/isAuthenticated')
            .get((req, res, next) => authController.isAuthenticated(req, res, next));

        app.route(root + '/controlUniquenessForEmail/:email')
            .get((req, res, next) => authController.controlUniquenessForEmail(req, res, next));

        app.route(root + '/getMyProfileCard')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => authController.getMyProfileCard(req, res, next));
    }
}