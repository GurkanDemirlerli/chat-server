import { Length, Matches, NotContains } from "class-validator";

export class LoginInput {

    @Length(5, 255, { message: "Your email must be minimum 5 and maximum 255 characters" })
    @Matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, { message: "Invalid email" })
    private email: string;

    @NotContains(" ", { message: "Whitespaces not allowed" })
    @Matches(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/, "Password Must have at least one uppercase, lowercase, special character, and number")
    private password: string;

    constructor(
        email: string,
        password: string,
    ) {
        this.email = email;
        this.password = password;
    }

    get getEmail(): string {
        return this.email;
    }

    get getPassword(): string {
        return this.password;
    }
}


//TODO türkçe karakter desteklenecek.