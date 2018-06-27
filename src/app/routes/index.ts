import { MessageRoutes } from './MessageRoutes';
import { UserRoutes } from './UserRoutes';
import * as express from 'express';
import { Container } from 'inversify';

export class RouteBinder {
    public static configureRoutes(app: express.Application, container: Container): void {
        UserRoutes.configureRoutes(app, container);
        MessageRoutes.configureRoutes(app, container);
    }
}