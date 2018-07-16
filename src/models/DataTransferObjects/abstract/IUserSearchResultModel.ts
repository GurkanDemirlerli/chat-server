export interface IUserSearchResultModel {
    _id?: String;
    username?: String;
    firstname?: String;
    lastname?: String;
    email?: String;
    isFriend?: Boolean;
    isSendedRequestWaiting?: Boolean;
    sendedRequestWaiting?: String;
    isReceivedRequestWaiting?: Boolean;
    receivedRequestWaiting?: String;
    isSelf?: Boolean;
}