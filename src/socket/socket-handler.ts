import { onlineUsers } from './online-users';
import { io } from '../server';
import { ISocketMessage } from '../models';

export class SocketHandler {
    constructor() {
        this.initialize();
    }
    
    initialize() {
        io.on('connection', (socket) => {
            socket.on('storeClientInfo', function (userName) {
                console.log('XXXXXXXXXXX');
                console.log(socket.id);
                console.log('YYYYYYYYYYYY');
                socket[userName] = userName;
                if (onlineUsers[userName]) {
                    onlineUsers[userName].socketIds.push(socket.id);
                } else {
                    onlineUsers[userName] = new Object();
                    onlineUsers[userName].socketIds = [];
                    onlineUsers[userName].socketIds.push(socket.id);
                    onlineUsers[userName].userName = userName;
                }
                console.log(onlineUsers);
            });

            socket.on('sendMessage', function (message:ISocketMessage) {
                
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

            socket.on('disconnect', function () {
                console.log('User Disconnected');
                Object.keys(onlineUsers).forEach(user => {
                    onlineUsers[user].socketIds.forEach(socketId => {
                        if (socketId == socket.id) {
                            if (onlineUsers[user].socketIds.length > 1) {
                                var index = onlineUsers[user].socketIds.indexOf(socket.id);
                                onlineUsers[user].socketIds.splice(index, 1);
                            } else {
                                delete onlineUsers[user];
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
