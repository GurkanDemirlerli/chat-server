import {
    IUser,
    IUserSearchResultModel,
    SignupInput,
    LoginInput,
    ILoginResult,
    IProfileCard,
} from '../../models';

export interface IUserService {
    signup(item: SignupInput): Promise<IProfileCard>;//
    login(item: LoginInput): Promise<ILoginResult>;// 
    changeNotificationId(userId, notifyId): Promise<any>;
    deleteNotificationId(userId): Promise<any>;
    listMyFriends(myId: string): Promise<any[]>;
    searchUsers(username: string, limit: number, skip: number, myId: string): Promise<IUserSearchResultModel[]>;
    getMyProfileCard(myId: string): Promise<IProfileCard>;
    controlUniquenessForEmail(email: string): Promise<boolean>;
    test(userId: string): Promise<any[]>;
}