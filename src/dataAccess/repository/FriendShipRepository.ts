import { injectable } from 'inversify';
import FriendShipSchema = require("./../schemas/friendship.schema");
import { IFriendShipRepository } from './interfaces/IFriendShipRepository';
import { RepositoryBase } from './RepositoryBase';
import { IFriendShip } from './../../models';
import 'reflect-metadata';

@injectable()
export class FriendShipRepository extends RepositoryBase<IFriendShip> implements IFriendShipRepository {
    constructor() {
        super(FriendShipSchema)
    }


}