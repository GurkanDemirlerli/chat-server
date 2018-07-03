import { injectable, inject } from 'inversify';
import { IOCTYPES } from '../ioc/ioc-types.enum';
import { IUserRepository, IFriendShipRepository, IFriendRequestRepository } from './../dataAccess/repository';
import { IFriendShipService } from './interfaces';
import 'reflect-metadata';

@injectable()
export class FriendShipService implements IFriendShipService {

    constructor(
        @inject(IOCTYPES.USER_REPOSITORY) private _userRepository: IUserRepository,
        @inject(IOCTYPES.FRIENDSHIP_REPOSITORY) private _friendShipRepository: IFriendShipRepository,
        @inject(IOCTYPES.FRIENDREQUEST_REPOSITORY) private _friendRequestRepository: IFriendRequestRepository
    ) { }

}
