import {
    FriendshipRequestDetailResult,
    UserSummary,
    FriendshipRequestCreateResult
} from '../models/DataTransferObjects';
import { IFriendRequest, IUser } from '../models';
import chalk from 'chalk';
import * as _ from "lodash";
import { AppError } from '../errors/AppError';
import { DTO } from '../models/DataTransferObjects/concrete/DTO';

export module Mapper {
    // export function friendshipRequest_to_FriendshipRequestDetailResult(item: IFriendRequest, fetcherId: string): FriendshipRequestDetailResult {
    //     let isSelf = false;
    //     if (fetcherId === (item.sender as IUser)._id.toString())
    //         isSelf = true;
    //     return new FriendshipRequestDetailResult(
    //         item._id,
    //         new UserSummary(
    //             (item.sender as IUser)._id,
    //             (item.sender as IUser).firstname,
    //             (item.sender as IUser).lastname,
    //             (item.sender as IUser).username
    //         ),
    //         new UserSummary(
    //             (item.receiver as IUser)._id,
    //             (item.receiver as IUser).firstname,
    //             (item.receiver as IUser).lastname,
    //             (item.receiver as IUser).username
    //         ),
    //         item.requestTime,
    //         item.requestMessage,
    //         item.status,
    //         isSelf
    //     )
    // }

    // export function friendshipRequest_to_FriendshipRequestCreateResult(item: IFriendRequest): FriendshipRequestCreateResult {
    //     console.log('UP');
    //     return new FriendshipRequestCreateResult(
    //         item._id,
    //         (item.sender as string),
    //         (item.receiver as string),
    //         item.requestTime,
    //         item.requestMessage,
    //         item.status
    //     )
    // }


    // export function IFriendRequest_TO_FriendshipRequestDetailResult(from: IFriendRequest): FriendshipRequestDetailResult {
    //     let subClasses = [{
    //         propName: 'sender',
    //         type: UserSummary,
    //         isArray: false,
    //     }, {
    //         propName: 'receiver',
    //         type: UserSummary,
    //         isArray: false,
    //     },];
    //     return basicMap(from, FriendshipRequestDetailResult, [], subClasses);
    // }


    export interface SubClass<V> {
        propName: string;
        type: (new () => V);
    }

    export function basicMap<T, U>(from: T, typeTo: (new () => U), options: any[] = [], types: SubClass<any>[] = []): U {
        let to = new typeTo();
        let exceptionalKeys: string[] = [];
        options.forEach(option => {
            switch (option.name) {
                case 'fromOtherKey':
                    to[option.toKey] = from[option.fromKey];
                    exceptionalKeys.push(option.toKey);
                    break;

                default:
                    throw new Error(`${option.name} adında bir seçenek yok.`);
                // break;
            }
        });
        types.forEach((type) => {
            if (from[type.propName] instanceof Array) {
                from[type.propName].forEach(item => {
                    // console.log(item);
                    let temp = basicMap(item, type.type);
                    // console.log(temp);
                    to[type.propName].push(temp);
                });
            } else {
                to[type.propName] = basicMap(from[type.propName], type.type);
            }
            exceptionalKeys.push(type.propName);
        })

        for (let key in to) {
            let _key: string = key;
            if (!(_.includes(exceptionalKeys, _key))) {
                to[_key] = from[_key];
                // console.log(typeof to[_key]);
            }
        }


        return to;
    }

    export function friendshipRequest_to_FriendshipRequestCreateResult(from: IFriendRequest) {
        let to = new FriendshipRequestCreateResult();
        for (let key in to) {
            to[key] = from[key];
        }
        return to;
    }
}



//KENARDA DURSUN

// if(! Array.isArray(classNames) ){
//     classNames = [classNames]
// }