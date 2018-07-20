import { injectable } from 'inversify';
import { onlineUsers } from './online-users';
import { io } from '../server';
import { IFriendViewModel, OnlineUser } from '../models';
import { AuthenticationService, IUserService, IFriendShipService } from '../business';
import { inject } from 'inversify';
import { IOCTYPES } from '../ioc';
import chalk from 'chalk';


@injectable()
export class SocketHandler {
    constructor(
        @inject(IOCTYPES.USER_SERVICE) private _userService: IUserService,
        @inject(IOCTYPES.FRIEND_SHIP_SERVICE) private _friendShipService: IFriendShipService
    ) {
        this.initialize();
    }

    initialize() {

        io.on('connection', (socket) => {
            socket.on('storeClientInfo', (token) => {
                try {
                    AuthenticationService.checkAuthenticationForSocket(token).then((isAuth) => {
                        if (isAuth) {
                            socket[isAuth._id] = isAuth._id;
                            if (onlineUsers[isAuth._id]) {
                                onlineUsers[isAuth._id].socketIds.push(socket.id);
                            } else {
                                onlineUsers[isAuth._id] = new Object();
                                onlineUsers[isAuth._id].socketIds = [];
                                onlineUsers[isAuth._id].socketIds.push(socket.id);
                                onlineUsers[isAuth._id].email = isAuth.email;

                                this._friendShipService.getFriendIds(isAuth._id).then((friends) => {
                                    friends.forEach(friend => {
                                        try {
                                            onlineUsers[friend].socketIds.forEach(socketId => {
                                                io.to(socketId).emit('beingOnline', isAuth._id);
                                            });
                                        } catch (error) {
                                        }
                                    });
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }
                            console.log(onlineUsers);
                        } else {
                            console.log('Socket kimligi dogrulanamadi');
                        }
                    });
                } catch (error) {
                    console.log('Socket kimligi dogrulanirken hata:', error);
                }


            });

            socket.on('disconnect', () => {
                Object.keys(onlineUsers).forEach(user => {
                    onlineUsers[user].socketIds.forEach(socketId => {
                        if (socketId == socket.id) {
                            if (onlineUsers[user].socketIds.length > 1) {
                                var index = onlineUsers[user].socketIds.indexOf(socket.id);
                                onlineUsers[user].socketIds.splice(index, 1);
                            } else {

                                delete onlineUsers[user];

                                this._friendShipService.getFriendIds(user).then((friends) => {
                                    friends.forEach(friend => {
                                        try {
                                            onlineUsers[friend].socketIds.forEach(friendSocketId => {
                                                io.to(friendSocketId).emit('beingOffline', user);
                                            });
                                        } catch (error) {
                                        }
                                    });
                                }).catch((error) => {
                                    console.log('error at disconnect ', error);
                                });
                            }
                        }
                    });
                });

            });
        });
    }
}