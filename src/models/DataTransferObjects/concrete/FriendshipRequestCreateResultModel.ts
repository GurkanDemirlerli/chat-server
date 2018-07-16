export class FriendshipRequestCreateResult {
    public _id: string = undefined;
    public sender: string = undefined;
    public receiver: string = undefined;
    public requestTime: Date = undefined;
    public requestMessage?: string = undefined;
    public status?: number = undefined;
    constructor(

    ) { }
}