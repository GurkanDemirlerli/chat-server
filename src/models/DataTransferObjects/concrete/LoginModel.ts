import { ILoginModel } from './../../'

export class LoginModel implements ILoginModel {
    email: string;
    password: string;

    constructor(_loginModel: ILoginModel) {
        this.email = _loginModel.email;
        this.password = _loginModel.password;
    }
}