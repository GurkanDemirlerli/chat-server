import { DTO } from "./DTO";

export class UserSummary extends DTO {
    _id: string = undefined;
    username: string = undefined;
    firstname: string = undefined;
    // lastname: string = undefined;
}

// export class UserSummary {
//     _id: string;
//     username: string;
//     firstname: string;
//     lastname: string;

//     constructor(
//         _id: string,
//         firstname: string,
//         lastname: string,
//         username: string,
//     ) {
//         this._id = _id;
//         this.username = username;
//         this.firstname = firstname;
//         this.lastname = lastname;
//     }
// }