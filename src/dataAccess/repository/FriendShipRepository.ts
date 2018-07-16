import { injectable } from 'inversify';
import FriendShipSchema = require("../schemas/friendship.schema");
import { IFriendShipRepository } from './interfaces/IFriendShipRepository';
import { RepositoryBase } from './RepositoryBase';
import { IFriendShip } from '../../models';
import 'reflect-metadata';

@injectable()
export class FriendShipRepository extends RepositoryBase<IFriendShip> implements IFriendShipRepository {
    constructor() {
        super(FriendShipSchema)
    }
    arkadaslikKontrol(myId, friendId): Promise<boolean> {
        let p = new Promise<boolean>((resolve, reject) => {
            FriendShipSchema
                .find({})
                .or([{
                    sender: myId,
                    acceptor: friendId
                }, {
                    sender: friendId,
                    acceptor: myId
                }
                ])
                .exec((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        if (!res.length) {
                            resolve(false);
                        } else {
                            resolve(true);
                        }
                    }
                });
        });
        return p;
    }
}