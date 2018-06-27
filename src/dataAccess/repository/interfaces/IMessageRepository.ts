import { IRepositoryBase } from './IRepositoryBase';
import { IMessage } from './../../../models';

export interface IMessageRepository extends IRepositoryBase<IMessage> {
    list: () => Promise<IMessage[]>;
}