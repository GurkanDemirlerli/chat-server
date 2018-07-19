import { AuthController } from '../controllers';
import * as express from 'express';
import { Container } from 'inversify';
import { AuthenticationService } from '../../business';

export class AuthRoutes {
    public static configureRoutes(app: express.Application, container: Container): void {
        const root = "/api/auth";
        const authController = container.get(AuthController);

        app.route(root + '/isAuthenticated')
            .get((req, res, next) => authController.isAuthenticated(req, res, next));


        app.route(root + '/test')
            .get((req, res, next) => authController.test(req, res, next));
    }
}