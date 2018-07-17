import { Container } from 'inversify';
import { IOCTYPES } from './ioc-types.enum';
import { SocketHandler } from '../socket/socket-handler';

//#region IMPORTS
//#region CONTROLLER IMPORTS
import {
    MessagesController,
    UsersController,
    FriendShipController,
    LocalNotificationsController,
    AuthController,
} from '../app/controllers';
//#endregion

//#region REPOSITORY IMPORTS
import {
    MessageRepository,
    FriendShipRepository,
    FriendRequestRepository,
    UserRepository,
    LocalNotificationRepository,
} from '../dataAccess/repository';
import {
    IMessageRepository,
    IUserRepository,
    IFriendShipRepository,
    IFriendRequestRepository,
    ILocalNotificationRepository,
} from '../dataAccess/repository';
//#endregion

//#region  SERVICE IMPORTS
import {
    MessageService,
    UserService,
    NotificationService,
    FriendShipService,
    LocalNotificationService

} from '../business';
import {
    IMessageService,
    IUserService,
    INotificationService,
    IFriendShipService,
    ILocalNotificationService

} from '../business';
//#endregion
//#endregion

export module IOC {
    export const container = new Container()

    export function configureContainer(): Container {

        container
            .bind<SocketHandler>(SocketHandler)
            .toSelf()

        //#region CONTROLLERS

        container
            .bind<MessagesController>(MessagesController)
            .toSelf()

        container
            .bind<UsersController>(UsersController)
            .toSelf()

        container
            .bind<FriendShipController>(FriendShipController)
            .toSelf()

        container
            .bind<LocalNotificationsController>(LocalNotificationsController)
            .toSelf()

        container
            .bind<AuthController>(AuthController)
            .toSelf()


        //#endregion

        //#region REPOSITORIES

        container
            .bind<IMessageRepository>(IOCTYPES.MESSAGE_REPOSITORY)
            .to(MessageRepository)

        container
            .bind<IUserRepository>(IOCTYPES.USER_REPOSITORY)
            .to(UserRepository)

        container
            .bind<IFriendShipRepository>(IOCTYPES.FRIENDSHIP_REPOSITORY)
            .to(FriendShipRepository)

        container
            .bind<IFriendRequestRepository>(IOCTYPES.FRIENDREQUEST_REPOSITORY)
            .to(FriendRequestRepository)

        container
            .bind<ILocalNotificationRepository>(IOCTYPES.LOCALNOTIFICATION_REPOSITORY)
            .to(LocalNotificationRepository)

        //#endregion

        //#region SERVICES

        container
            .bind<IMessageService>(IOCTYPES.MESSAGE_SERVICE)
            .to(MessageService)

        container
            .bind<IUserService>(IOCTYPES.USER_SERVICE)
            .to(UserService)

        container
            .bind<INotificationService>(IOCTYPES.NOTIFICATION_SERVICE)
            .to(NotificationService)

        container
            .bind<IFriendShipService>(IOCTYPES.FRIEND_SHIP_SERVICE)
            .to(FriendShipService)

        container
            .bind<ILocalNotificationService>(IOCTYPES.LOCAL_NOTIFICATION_SERVICE)
            .to(LocalNotificationService)



        //#endregion

        return container
    }

}