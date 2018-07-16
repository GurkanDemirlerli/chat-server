import { LocalNotificationsController } from '../controllers';
import * as express from 'express';
import { Container } from 'inversify';
import { AuthenticationService } from '../../business';

export class LocalNotificationRoutes {
    public static configureRoutes(app: express.Application, container: Container): void {
        const root = "/api/local-notifications";
        const localNotificationsController = container.get(LocalNotificationsController);


        app.route(root + '/list')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => localNotificationsController.list(req, res, next));

        app.route(root + '/unreadedCount')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => localNotificationsController.unreadedCount(req, res, next));

        app.route(root + '/makeAllReaded')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => localNotificationsController.makeAllReaded(req, res, next));
    }
}









