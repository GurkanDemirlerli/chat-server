import { UserRepository } from './../dataAccess/repository';

export function kullaniciEkleme() {

    let ur = new UserRepository();

    const u1 = {
        email: "ronaldo@e.com",
        name: "ronaldo",
        password: "Password123.",
    };

    const u2 = {
        email: "messi@e.com",
        name: "messi",
        password: "Password123.",
    };

    const u3 = {
        email: "neymar@e.com",
        name: "neymar",
        password: "Password123.",
    };


    ur.create(u1).then((user) => {
        console.log("User Created :", user);
    }).catch((error) => {
        console.log("User Did Not Created :", error);
    });

    ur.create(u2).then((user) => {
        console.log("User Created :", user);
    }).catch((error) => {
        console.log("User Did Not Created :", error);
    });

    ur.create(u3).then((user) => {
        console.log("User Created :", user);
    }).catch((error) => {
        console.log("User Did Not Created :", error);
    });
}
