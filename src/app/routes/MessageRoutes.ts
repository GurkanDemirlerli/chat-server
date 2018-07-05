import { MessagesController } from './../controllers';
import * as express from 'express';
import { Container } from 'inversify';
import { AuthenticationService } from '../../business';

export class MessageRoutes {
    public static configureRoutes(app: express.Application, container: Container): void {

        const messagesController = container.get(MessagesController);

        app.route('/api/messages/add')
            .post(AuthenticationService.authenticatedRoute, (req, res, next) => messagesController.add(req, res, next));
        app.route('/api/messages/makeAllReceivedMessagesReadedFromMyFriend/:friendId')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => messagesController.makeAllReceivedMessagesReadedFromMyFriend(req, res, next));
    }
}