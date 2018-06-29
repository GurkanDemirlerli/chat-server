import { injectable } from 'inversify';
import { onlineUsers } from './online-users';
import { io } from '../server';
import { ISocketMessage } from '../models';
import { AuthenticationService, IUserService } from '../business';
import { inject } from 'inversify';
import { IOCTYPES } from '../ioc';

@injectable()
export class SocketHandler {
    constructor(
        @inject(IOCTYPES.USER_SERVICE) private _userService: IUserService
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

                                this._userService.listMyFriends(isAuth._id).then((friends) => {
                                    friends.forEach(friend => {
                                        try {
                                            onlineUsers[friend._id].socketIds.forEach(socketId => {
                                                io.to(socketId).emit('onlineFriends', { message: 'Giris yapti :', friend: isAuth });
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

            socket.on('sendMessage', function (message: ISocketMessage) {

            });

            socket.on('sendSignalToSubscribers', function (data) {
                console.log(data.users);
                data.users.forEach(user => {
                    console.log("***USER***");
                    console.log(user);
                    try {
                        onlineUsers[user].socketIds.forEach(socketId => {
                            console.log(socketId);
                            console.log("**");
                            io.to(socketId).emit('receiveSignal', { message: data.message, from: data.from });
                        });
                    } catch (error) {
                        console.log('mesaj gitmedi');
                        console.log(error);
                    }
                });
            });

            socket.on('disconnect', () => {
                console.log('User Disconnected');
                Object.keys(onlineUsers).forEach(user => {
                    onlineUsers[user].socketIds.forEach(socketId => {
                        if (socketId == socket.id) {
                            if (onlineUsers[user].socketIds.length > 1) {
                                var index = onlineUsers[user].socketIds.indexOf(socket.id);
                                onlineUsers[user].socketIds.splice(index, 1);
                            } else {

                                delete onlineUsers[user];

                                this._userService.listMyFriends(user).then((friends) => {
                                    friends.forEach(friend => {
                                        try {
                                            onlineUsers[friend._id].socketIds.forEach(friendSocketId => {
                                                io.to(friendSocketId).emit('onlineFriends', { message: 'Cikis yapti :', friend: user });
                                            });
                                        } catch (error) {
                                        }
                                    });
                                }).catch((error) => {
                                    console.log(error);
                                });
                            }
                        }
                    });
                });
            });
        });
    }
}

// exports = module.exports = function (io) {


// }
