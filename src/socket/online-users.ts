export let onlineUsers: Object = {};

// import { OnlineUser } from './../models';


// class OnlineUsers {

//     private static _instance: OnlineUsers = new OnlineUsers();

//     public static data: OnlineUser[];

//     constructor() {
//         if (OnlineUsers._instance) {
//             throw new Error("Error: Instantiation failed: Use OnlineUsers.getInstance() instead of new.");
//         }
//         OnlineUsers._instance = this;
//         OnlineUsers.data = [];
//     }

//     public static addNewUser(user: OnlineUser) {
//         this.data.push(user);
//         this[user._id] = user;
//     }

//     public static getInstance(): OnlineUsers {
//         return OnlineUsers._instance;
//     }

// }

// export let onlineUsers = OnlineUsers.getInstance();