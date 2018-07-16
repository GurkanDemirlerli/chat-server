import { validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max, Matches, Equals, ValidateIf, NotEquals, NotContains } from "class-validator";

export class SignupInput {

    @Length(5, 255, { message: "Your email must be minimum 5 and maximum 255 characters" })
    @Matches(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, { message: "Invalid email" })
    private email: string;

    @Length(5, 15, { message: "your username must be minumum 5 and maximum 15 characters" })
    @Matches(/^[a-zA-Z0-9]+$/, { message: "Only alphanuremic characters allowed" })
    private username: string;

    @Length(2, 20, { message: "your first name must be minumum 2 and maximum 20 characters" })
    @Matches(/^[a-zA-Z]+$/, { message: "Numbers or special characters not allowed" })
    private firstname: string;

    @Length(2, 20, { message: "your last name must be minumum 2 and maximum 20 characters" })
    @Matches(/^[a-zA-Z]+$/, { message: "Numbers or special characters not allowed" })
    private lastname: string;

    @NotContains(" ", { message: "Whitespaces not allowed" })
    @Matches(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/, "Password Must have at least one uppercase, lowercase, special character, and number")
    private password: string;

    @Length(0, 300, { message: "about of you must be maximum 300 characters" })
    private about?: string;

    constructor(
        email: string,
        username: string,
        firstname: string,
        lastname: string,
        password: string,
        about?: string
    ) {
        this.email = email;
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.password = password;
        if (about)
            this.about = about;
    }

    get getEmail(): string {
        return this.email;
    }

    get getUsername(): string {
        return this.username;
    }

    get getFirstname(): string {
        return this.firstname;
    }

    get getLastname(): string {
        return this.lastname;
    }

    get getPassword(): string {
        return this.password;
    }
}


//TODO türkçe karakter desteklenecek.