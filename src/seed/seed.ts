import { inject, injectable } from "inversify";
import { IOCTYPES } from "../ioc";
import {
    IUserService,
    IMessageService,
    IFriendShipService,
} from "../business";
import {
    SignupInput,
    FriendshipRequestCreateModel,
    IFriendshipViewModel,
    IFriendshipRequestViewModel,
    IProfileCard,
    MessageCreateModel,
    IChatMessageViewModel
} from '../models';
import * as faker from 'faker';
import chalk from 'chalk';

@injectable()
export class SeedDatabase {

    constructor(
        @inject(IOCTYPES.USER_SERVICE) private _userService: IUserService,
        @inject(IOCTYPES.MESSAGE_SERVICE) private _messsageService: IMessageService,
        @inject(IOCTYPES.FRIEND_SHIP_SERVICE) private _friendshipService: IFriendShipService
    ) {
    }

    public initialize() {
        const USERCOUNT = 30;
        let users = [];
        let promises = [];
        let promisesForAccepting = [];
        let promisesForRejecting = [];
        let promisesForMessaging = [];

        for (let i = 0; i < USERCOUNT; i++) {
            let username = faker.internet.userName();
            let firstname = faker.name.firstName();
            let lastname = faker.name.lastName();
            let email = faker.internet.email();
            let password = 'Password123.';
            let about = faker.lorem.sentence(20, 150);
            users.push(new SignupInput(
                email,
                username,
                firstname,
                lastname,
                password,
                about
            ));
            promises.push(this._userService.signup(users[i]));
        }

        Promise.all(promises).then((createdUsers: IProfileCard[]) => {
            console.log('Kullanıcılar Eklendi.')
            users = createdUsers;
            let promises = [];
            for (let i = 0; i < USERCOUNT; i++) {
                for (let j = i + 1; j < USERCOUNT; j++) {
                    let sender = users[i]._id;
                    let receiver = users[j]._id;
                    let requestMessage = faker.lorem.sentence(5, 50);
                    promises.push(this._friendshipService.sendFriendshipRequest(new FriendshipRequestCreateModel(
                        sender,
                        receiver,
                        requestMessage
                    )));
                }
            }

            return Promise.all(promises);
        }).then((sendedFriendshipRequests: IFriendshipRequestViewModel[]) => {
            console.log('Arkadaşlık istekleri eklendi.');
            promises = [];
            promisesForAccepting = [];
            promisesForRejecting = [];
            let iteration = 0;
            for (let i = 0; i < USERCOUNT; i++) {
                for (let j = i + 1; j < USERCOUNT; j++) {
                    let option = Math.floor(Math.random() * 3) + 1;//[1,3] araliginda 
                    switch (option) {
                        case 1:
                            promisesForAccepting.push(this._friendshipService.acceptFriendshipRequest(sendedFriendshipRequests[iteration]._id, sendedFriendshipRequests[iteration].receiver._id.toString()));
                            break;
                        case 2:
                            promisesForRejecting.push(this._friendshipService.rejectFriendshipRequest(sendedFriendshipRequests[iteration]._id, sendedFriendshipRequests[iteration].receiver._id.toString()));
                            break;
                        default:
                            //istek beklemede kalacak.
                            break;
                    }
                    iteration++;
                }
            }
            console.log('Bazı istekler bekletildi.');
            return Promise.all(promisesForRejecting);
        }).then((rejectedFriendshipRequests: IFriendshipRequestViewModel[]) => {
            console.log('Bazı istekler reddedildi.')
            return Promise.all(promisesForAccepting);
        }).then((friendShips: IFriendshipViewModel[]) => {
            promisesForMessaging = [];
            console.log('Bazı istekler kabul edildi.');
            for (let i = 0; i < friendShips.length; i++) {
                let totalChatMessages = Math.floor(Math.random() * 100);//[0,100] araliginda
                for (let j = 0; j < totalChatMessages; j++) {
                    let randomForMessageSender = Math.floor(Math.random() * 2);//[0,1] araliginda
                    let messageSender;
                    let messageReceiver;
                    let content = faker.lorem.sentence(Math.floor(Math.random() * 11) + 1, Math.floor(Math.random() * 100) + 1)
                    if (randomForMessageSender === 0) {
                        messageSender = friendShips[i].sender._id;
                        messageReceiver = friendShips[i].acceptor._id;
                    }
                    else {
                        messageSender = friendShips[i].acceptor._id;
                        messageReceiver = friendShips[i].sender._id;
                    }
                    let message = new MessageCreateModel(
                        messageSender,
                        messageReceiver,
                        content
                    )
                    promisesForMessaging.push(this._messsageService.add(message));
                }
            }
            return Promise.all(promisesForMessaging);

        }).then((messages: IChatMessageViewModel[]) => {
            console.log('Mesajlar eklendi');




            console.log(chalk.blue('Seed is Done'));
        }).catch((error: Error) => {
            console.log(error);
        });
    }
}