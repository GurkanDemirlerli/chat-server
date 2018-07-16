export class FriendshipRequestCreateModel {
    sender: string;
    receiver: string;
    requestMessage?: string;

    constructor(
        sender: string,
        receiver: string,
        requestMessage: string
    ) {
        this.sender = sender;
        this.receiver = receiver;
        if (requestMessage)
            this.requestMessage = requestMessage;
    }
}
