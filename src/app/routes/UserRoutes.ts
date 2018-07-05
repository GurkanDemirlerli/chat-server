import { UsersController } from './../controllers';
import * as express from 'express';
import { Container } from 'inversify';
import { AuthenticationService } from './../../business/';

export class UserRoutes {
    public static configureRoutes(app: express.Application, container: Container): void {

        const usersController = container.get(UsersController);

        app.route('/api/users/signup')
            .post((req, res, next) => usersController.signup(req, res, next));
        app.route('/api/users/login')
            .post((req, res, next) => usersController.login(req, res, next));
        app.route('/api/users/changeNotificationId')
            .post((req, res, next) => usersController.changeNotificationId(req, res, next));
        app.route('/api/users/deleteNotificationId')
            .post((req, res, next) => usersController.deleteNotificationId(req, res, next));
        app.route('/api/users/listMyFriends')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => usersController.listMyFriends(req, res, next));
        app.route('/api/users/friendShipRequest')
            .post(AuthenticationService.authenticatedRoute, (req, res, next) => usersController.friendShipRequest(req, res, next));
        app.route('/api/users/acceptFriendShipRequest')
            .post(AuthenticationService.authenticatedRoute, (req, res, next) => usersController.acceptFriendShipRequest(req, res, next));
        app.route('/api/users/findMyFriend/:friendId')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => usersController.findMyFriend(req, res, next));
        app.route('/api/users/getMessagesBetweenMyFriend/:friendId')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => usersController.getMessagesBetweenMyFriend(req, res, next));
        app.route('/api/users/getMyProfileCard')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => usersController.getMyProfileCard(req, res, next));
        app.route('/api/users/searchUsersByName')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => usersController.searchUsersByName(req, res, next));
        app.route('/api/users/getMyNotifications')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => usersController.getMyNotifications(req, res, next));
        app.route('/api/users/getUnReadedNotificationsCount')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => usersController.getUnReadedNotificationsCount(req, res, next));
        app.route('/api/users/makeAllNotificationsReaded')
            .get(AuthenticationService.authenticatedRoute, (req, res, next) => usersController.makeAllNotificationsReaded(req, res, next));
        

    }
}