
//#region DTO
export { ILoginModel } from './DataTransferObjects/abstract/ILoginModel';
export { ISignupModel } from './DataTransferObjects/abstract/ISignupModel';
export { ITokenModel } from './DataTransferObjects/abstract/ITokenModel';
export { ISocketMessage } from './DataTransferObjects/abstract/ISocketMessage';
export { IFriendRequestCreateModel } from './DataTransferObjects/abstract/IFriendRequestCreateModel';
export { IUserSearchResultModel } from './DataTransferObjects/abstract/IUserSearchResultModel';
export { ILocalNotificationType } from './DataTransferObjects/abstract/ILocalNotificationType';


export { SignupInput } from './DataTransferObjects/concrete/SignupInput';
export { LoginInput } from './DataTransferObjects/concrete/LoginInput';
export { FriendshipRequestCreateModel } from './DataTransferObjects/concrete/FriendshipRequestCreateModel';

//#endregion


//#region DAO
export { IUser } from './DataAccessObjects/abstract/IUser';
export { ITask } from './DataAccessObjects/abstract/ITask';
export { IMessage } from './DataAccessObjects/abstract/IMessage';
export { IFriendShip } from './DataAccessObjects/abstract/IFriendShip';
export { IFriendRequest } from './DataAccessObjects/abstract/IFriendRequest';
export { ILocalNotification } from './DataAccessObjects/abstract/ILocalNotification';
//#endregion


export interface ILoginResult {
    id: string;
    email: string;
    token: string;
}

export interface IUserSummary {
    _id: string;
    username: string;
    firstname: string;
    lastname: string;
}

export interface IUserDetails extends IUserSummary {
    about?: string;
}

export interface IFriendViewModel extends IUserDetails {
    status?: string;//online ve offline var simdilik. enuma cevrilecek.
    unReadedMessagesCount?: number;
}

export interface IFriendshipViewModel {
    _id: string;
    sender: IUserDetails;
    acceptor: IUserDetails;
    createdAt?: Date;
}


export interface IFriendshipRequestViewModel {
    _id: string;
    sender: IUserSummary;
    receiver: IUserSummary;
    createdAt: Date;
    requestMessage: string;
    status: number;
    isSelfRequest?: boolean;
}

export interface ISendedFriendshipRequest {
    _id: string;
    receiver: IUserSummary;
    createdAt: Date;
    requestMessage: string;
    status: number;
}

export interface IReceivedFriendshipRequest {
    _id: string;
    sender: IUserSummary;
    createdAt: Date;
    requestMessage: string;
    status: number;
}

export interface ILocalNotificationCreateModel {
    contentType: number;
    from: string;
    to: string;
}

export interface ILocalNotificationViewModel {
    _id: string;
    contentType: number;
    from: IUserSummary;
    to: string;
    isRead: boolean;
}



export class MessageCreateModel {
    from: string;
    to: string;
    content: string;

    constructor(
        from: string,
        to: string,
        content: string,

    ) {
        this.from = from;
        this.to = to;
        this.content = content;
    }
}

export interface IChatMessageViewModel {
    content: string;
    from: string;
    to: string;
    createdAt: Date;
    isRead: boolean;
}

export interface IProfileCard {
    _id: string;
    username: string;
    firstname: string;
    lastname: string;
    about?: string;
}

export interface ISignupResult {
    _id: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    about: string;
    createdAt: string;
}

export interface IUserSearchResult {

}
