import { FriendShipController } from '../controllers';
import * as express from 'express';
import { Container } from 'inversify';
import { AuthenticationService } from '../../business';

export class FriendShipRoutes {
    public static configureRoutes(app: express.Application, container: Container): void {
        const root = "/api/friendship";
        const friendShipController = container.get(FriendShipController);

        app.route(root + '/send')
            .post(AuthenticationService.authenticatedRoute, (req, res, next) => friendShipController.send(req, res, next));

        app.route(root + '/accept/:id')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => friendShipController.accept(req, res, next));

        app.route(root + '/reject/:id')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => friendShipController.reject(req, res, next));

        app.route(root + '/cancel/:id')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => friendShipController.cancel(req, res, next));

        app.route(root + '/getReceivedRequestCount')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => friendShipController.getReceivedRequestCount(req, res, next));

        app.route(root + '/listSendedRequests')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => friendShipController.listSendedRequests(req, res, next));

        app.route(root + '/listReceivedRequests')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => friendShipController.listReceivedRequests(req, res, next));

        app.route(root + '/listFriends')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => friendShipController.listFriends(req, res, next));

        app.route(root + '/remove/:id')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => friendShipController.remove(req, res, next));

        app.route(root + '/findFriend/:friendId')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => friendShipController.findFriend(req, res, next));
    }
}