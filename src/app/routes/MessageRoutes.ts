import { MessagesController } from './../controllers';
import * as express from 'express';
import { Container } from 'inversify';

export class MessageRoutes {
    public static configureRoutes(app: express.Application, container: Container): void {

        const messagesController = container.get(MessagesController);

        app.route('/api/messages/add')
            .post((req, res, next) => messagesController.add(req, res, next));
    }
}