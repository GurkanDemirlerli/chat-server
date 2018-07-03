import { FriendShipController } from './../controllers';
import * as express from 'express';
import { Container } from 'inversify';
import { AuthenticationService } from './../../business/';

export class FriendShipRoutes {
    public static configureRoutes(app: express.Application, container: Container): void {

        const friendShipController = container.get(FriendShipController);

        app.route('/api/friendship/sendFriendShipRequest')
            .post(AuthenticationService.authenticatedRoute, (req, res, next) => friendShipController.sendFriendShipRequest(req, res, next));

        app.route('/api/friendship/acceptFriendShipRequest')
            .post(AuthenticationService.authenticatedRoute, (req, res, next) => friendShipController.acceptFriendShipRequest(req, res, next));

        app.route('/api/friendship/rejectFriendShipRequest')
            .post(AuthenticationService.authenticatedRoute, (req, res, next) => friendShipController.rejectFriendShipRequest(req, res, next));

        app.route('/api/friendship/cancelSendedFriendShipRequest')
            .post(AuthenticationService.authenticatedRoute, (req, res, next) => friendShipController.cancelSendedFriendShipRequest(req, res, next));

        // app.route('/api/friendship/removeFriendShip')
        //     .post(AuthenticationService.authenticatedRoute, (req, res, next) => friendShipController.removeFriendShip(req, res, next));
    }
}