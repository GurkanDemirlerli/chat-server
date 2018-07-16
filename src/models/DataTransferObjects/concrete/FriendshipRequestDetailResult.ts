import { UserSummary } from "./UserSummary";

export class MessageTest {
    content: string = undefined;
    from: string = undefined;
    to: string = undefined;
}
export class FriendshipRequestDetailResult {
    _id: string = undefined;
    sender: UserSummary = undefined;
    // receiver: UserSummary = undefined;
    // requestTime: Date = undefined;
    requestMessage: string = undefined;
    status: number = undefined;
    isSelfRequest: boolean = undefined;
    dummy: MessageTest[] = [];
    constructor() {
        // this.sender = new UserSummary();
    }
    // constructor(
    //     _id: string,
    //     sender: UserSummary,
    //     receiver: UserSummary,
    //     requestTime: Date,
    //     requestMessage: string,
    //     status: number,
    //     isSelfRequest: boolean,
    // ) {
    //     this._id = _id;
    //     this.sender = sender;
    //     this.receiver = receiver;
    //     this.requestTime = requestTime;
    //     this.requestMessage = requestMessage;
    //     this.status = status;
    //     this.isSelfRequest = isSelfRequest;
    // }
}

// import { UserSummary } from "./UserSummary";

// export class FriendshipRequestDetailResult {
//     _id: string;
//     sender: UserSummary;
//     receiver: UserSummary;
//     requestTime: Date;
//     requestMessage: string;
//     status: number;
//     isSelfRequest: boolean;

//     constructor(
//         _id: string,
//         sender: UserSummary,
//         receiver: UserSummary,
//         requestTime: Date,
//         requestMessage: string,
//         status: number,
//         isSelfRequest: boolean,
//     ) {
//         this._id = _id;
//         this.sender = sender;
//         this.receiver = receiver;
//         this.requestTime = requestTime;
//         this.requestMessage = requestMessage;
//         this.status = status;
//         this.isSelfRequest = isSelfRequest;
//     }
// }

