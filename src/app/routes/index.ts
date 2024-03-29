import { LocalNotificationRoutes } from './LocalNotificationRoutes';
import { MessageRoutes } from './MessageRoutes';
import { UserRoutes } from './UserRoutes';
import { FriendShipRoutes } from './FriendShipRoutes';
import * as express from 'express';
import { Container } from 'inversify';
import { AuthRoutes } from './AuthRoutes';

export class RouteBinder {
    public static configureRoutes(app: express.Application, container: Container): void {
        UserRoutes.configureRoutes(app, container);
        MessageRoutes.configureRoutes(app, container);
        FriendShipRoutes.configureRoutes(app, container);
        LocalNotificationRoutes.configureRoutes(app, container);
        AuthRoutes.configureRoutes(app, container);
    }
}