import { IRepositoryBase } from './IRepositoryBase';
import { IFriendShip } from '../../../models';

export interface IFriendShipRepository extends IRepositoryBase<IFriendShip> {
    arkadaslikKontrol(myId, friendId): Promise<boolean> ;
}