import { injectable } from 'inversify';
import { onlineUsers } from './online-users';
import { io } from '../server';
import { IFriendViewModel } from '../models';
import { AuthenticationService, IUserService, IFriendShipService } from '../business';
import { inject } from 'inversify';
import { IOCTYPES } from '../ioc';

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
                let myId: string;
                AuthenticationService.checkAuthenticationForSocket(token).then((decodedToken) => {
                    myId = myId;
                    socket[myId] = myId;
                    if (onlineUsers.hasOwnProperty(myId)) {
                        onlineUsers[myId].socketIds.push(socket.id);
                    } else {
                        onlineUsers[myId] = new Object();
                        onlineUsers[myId].socketIds = [];
                        onlineUsers[myId].socketIds.push(socket.id);
                        onlineUsers[myId].email = decodedToken.email;
                    }
                    return this._friendShipService.listFriends(myId);
                }).then((friends: IFriendViewModel[]) => {
                    for (let i = 0; i < friends.length; i++) {
                        if (onlineUsers.hasOwnProperty(friends[i]._id)) {
                            for (let j = 0; j < onlineUsers[friends[i]._id].socketIds.length; i++) {
                                io.to(onlineUsers[friends[i]._id].socketIds[j]).emit('beingOnline', myId)
                            }
                        }
                    }
                }).catch((error: Error) => {
                    console.log(error);
                });
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

                                this._userService.listMyFriends(user).then((friends) => {
                                    friends.forEach(friend => {
                                        try {
                                            onlineUsers[friend._id].socketIds.forEach(friendSocketId => {
                                                io.to(friendSocketId).emit('beingOffline', user);
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

//ESKI

                // try {
                //     AuthenticationService.checkAuthenticationForSocket(token).then((isAuth) => {
                //         if (isAuth) {
                //             socket[isAuth._id] = isAuth._id;
                //             if (onlineUsers[isAuth._id]) {
                //                 onlineUsers[isAuth._id].socketIds.push(socket.id);
                //             } else {
                //                 onlineUsers[isAuth._id] = new Object();
                //                 onlineUsers[isAuth._id].socketIds = [];
                //                 onlineUsers[isAuth._id].socketIds.push(socket.id);
                //                 onlineUsers[isAuth._id].email = isAuth.email;

                //                 this._userService.listMyFriends(isAuth._id).then((friends) => {
                //                     friends.forEach(friend => {
                //                         try {
                //                             onlineUsers[friend._id].socketIds.forEach(socketId => {
                //                                 io.to(socketId).emit('beingOnline',  isAuth._id );
                //                             });
                //                         } catch (error) {
                //                         }
                //                     });
                //                 }).catch((error) => {
                //                     console.log(error);
                //                 });
                //             }
                //             console.log(onlineUsers);



                //         } else {
                //             console.log('Socket kimligi dogrulanamadi');
                //         }
                //     });
                // } catch (error) {
                //     console.log('Socket kimligi dogrulanirken hata:', error);
                // }




                            // socket.on('sendSignalToSubscribers', function (data) {
            //     console.log(data.users);
            //     data.users.forEach(user => {
            //         console.log("***USER***");
            //         console.log(user);
            //         try {
            //             onlineUsers[user].socketIds.forEach(socketId => {
            //                 console.log(socketId);
            //                 console.log("**");
            //                 io.to(socketId).emit('receiveSignal', { message: data.message, from: data.from });
            //             });
            //         } catch (error) {
            //             console.log('mesaj gitmedi');
            //             console.log(error);
            //         }
            //     });
            // });