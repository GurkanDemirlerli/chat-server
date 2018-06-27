import { MessagesController } from './../controllers';
import * as express from 'express';
import { Container } from 'inversify';

export class MessageRoutes {
    public static configureRoutes(app: express.Application, container: Container): void {

        const tasksController = container.get(MessagesController);

        app.route('/api/tasks/add')
            .post((req, res, next) => tasksController.add(req, res, next));

        app.route('/api/tasks/list')
            .get((req, res, next) => tasksController.list(req, res, next));
    }
}