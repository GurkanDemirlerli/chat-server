import { populateMongooseUserFields } from './../../utils/PopulateMongooseUserFields';
import { injectable } from 'inversify';
import UserSchema = require("../schemas/user.schema");
import { IUserRepository } from './interfaces/IUserRepository';
import { RepositoryBase } from './RepositoryBase';
import { IUser } from '../../models';
import 'reflect-metadata';

@injectable()
export class UserRepository extends RepositoryBase<IUser> implements IUserRepository {
    constructor() {
        super(UserSchema)
    }

    changeNotificationId(userId, notifyId) {
        let p = new Promise<IUser>((resolve, reject) => {
            UserSchema.update({ _id: userId }, { $set: { notificationId: notifyId } }, (err, res) => {
                if (err) {
                    console.log("User Repository Reject");
                    reject(err);
                }
                else {
                    console.log("User Repository Resolve", res);
                    resolve(res);
                }
            });
        });
        return p;
    }

    deleteNotificationId(userId): Promise<any> {
        let p = new Promise<IUser>((resolve, reject) => {
            UserSchema.update({ _id: userId }, { $set: { notificationId: "-" } }, (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res);
                }
            });
        });
        return p;
    }
    //TO DO : INDEXLEME YAPARAK ARAT
    searchUsers(username: string, limit: number, skip: number): Promise<IUser[]> {
        let p = new Promise<IUser[]>((resolve, reject) => {
            UserSchema
                .find({ username: new RegExp(username, 'i') })
                .select('_id username firstname lastname about')
                .limit(limit)
                .skip(skip)
                .exec((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });
        return p;
    }

    listMyFriends(myId: string): Promise<IUser> {
        let p = new Promise<IUser>((resolve, reject) => {
            UserSchema
                .findById(myId)
                .populate({
                    path: 'AcceptedFriendShips',
                    populate: [
                        {
                            path: 'sender',
                            select: '_id name email about'
                        }
                    ],
                    // select: 'sender'
                })
                .populate({
                    path: 'SendedFriendShips',
                    populate: [
                        {
                            path: 'acceptor',
                            select: '_id name email about'
                        }
                    ],
                    // select: 'acceptor'
                })

                .exec((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });
        return p;
    }


    getProfileCard(userId): Promise<IUser> {
        let p = new Promise<IUser>((resolve, reject) => {
            UserSchema
                .findById(userId)
                .select(populateMongooseUserFields.forUserDetails)
                .exec((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
        });
        return p;
    }
}