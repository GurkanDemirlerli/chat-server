export interface IUserSearchResultModel {
    _id?: String;
    name?: String;
    email?: String;
    isFriend?: Boolean;
    isSendedRequestWaiting?: Boolean;
    sendedRequestWaiting?: String;
    isReceivedRequestWaiting?: Boolean;
    receivedRequestWaiting?: String;
    isSelf?: Boolean;
}