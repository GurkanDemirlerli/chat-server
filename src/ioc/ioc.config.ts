import { Container } from 'inversify';
import { IOCTYPES } from './ioc-types.enum';

//#region IMPORTS
//#region CONTROLLER IMPORTS
import {
    MessagesController,
    UsersController,
} from './../app/controllers';
//#endregion

//#region REPOSITORY IMPORTS
import {
    MessageRepository,
    FriendShipRepository,
    FriendRequestRepository,
    UserRepository,
} from './../dataAccess/repository';
import {
    IMessageRepository,
    IUserRepository,
    IFriendShipRepository,
    IFriendRequestRepository,
} from './../dataAccess/repository';
//#endregion

//#region  SERVICE IMPORTS
import {
    MessageService,
    UserService,
    NotificationService,

} from './../business';
import {
    IMessageService,
    IUserService,
    INotificationService

} from './../business';
//#endregion
//#endregion

export module IOC {
    export const container = new Container()

    export function configureContainer(): Container {

        //#region CONTROLLERS

        container
            .bind<MessagesController>(MessagesController)
            .toSelf()

        container
            .bind<UsersController>(UsersController)
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
        //#endregion

        return container
    }

}