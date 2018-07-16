import { MessagesController } from '../controllers';
import * as express from 'express';
import { Container } from 'inversify';
import { AuthenticationService } from '../../business';

export class MessageRoutes {
    public static configureRoutes(app: express.Application, container: Container): void {
        const root = "/api/messages";

        const messagesController = container.get(MessagesController);

        app.route(root + '/add')
            .post(AuthenticationService.authenticatedRoute, (req, res, next) => messagesController.add(req, res, next));

        app.route(root + '/listChat/:friendId')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => messagesController.listChat(req, res, next));

        app.route(root + '/makeChatMessagesReaded/:friendId')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => messagesController.makeChatMessagesReaded(req, res, next));
    }
}