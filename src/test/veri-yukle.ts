import { inject, injectable } from "inversify";
import { IOCTYPES } from "../ioc";
import { IUserService } from "../business";
import { ISignupModel } from '../models';

@injectable()
export class VeriYukle {

    constructor(
        @inject(IOCTYPES.USER_SERVICE) private _userService: IUserService
    ) { }

    public kullaniciEkle() {
        const user1: ISignupModel = {
            name: "ronaldo",
            email: "ronaldo@example.com",
            password: "Password123."
        }

        const user2: ISignupModel = {
            name: "messi",
            email: "messi@example.com",
            password: "Password123."
        }

        const user3: ISignupModel = {
            name: "neymar",
            email: "neymar@example.com",
            password: "Password123."
        }

        const user4: ISignupModel = {
            name: "drogba",
            email: "drogba@example.com",
            password: "Password123."
        }

        Promise.all([
            this._userService.signup(user1),
            this._userService.signup(user2),
            this._userService.signup(user3),
            this._userService.signup(user4),
        ]).then((users) => {
            console.log(users);

            const ronaldo = users[0];
            const messi = users[1];
            const neymar = users[2];
            const drogba = users[3];

            const ronaldodan_messiye_arkadaslik_istegi = {
                sender: ronaldo._id,
                receiver: messi._id,
            };

            const ronaldodan_neymara_arkadaslik_istegi = {
                sender: ronaldo._id,
                receiver: neymar._id,
            };

            const drogbadan_messiye_arkadaslik_istegi = {
                sender: drogba._id,
                receiver: messi._id
            }

            const neymardan_drogbaya_arkadaslik_istegi = {
                sender: neymar._id,
                receiver: drogba._id
            }

            const drogbadan_ronaldoya_arkadaslik_istegi = {
                sender: drogba._id,
                receiver: ronaldo._id
            }

            Promise.all([
                this._userService.sendFriendShipRequest(ronaldodan_messiye_arkadaslik_istegi),
                this._userService.sendFriendShipRequest(ronaldodan_neymara_arkadaslik_istegi),
                this._userService.sendFriendShipRequest(drogbadan_messiye_arkadaslik_istegi),
                this._userService.sendFriendShipRequest(neymardan_drogbaya_arkadaslik_istegi),
                this._userService.sendFriendShipRequest(drogbadan_ronaldoya_arkadaslik_istegi),
            ]).then((istekler) => {
                console.log(istekler);
                const ronaldodan_messiye_arkadaslik_istegi = istekler[0];
                const ronaldodan_neymara_arkadaslik_istegi = istekler[1];
                const drogbadan_messiye_arkadaslik_istegi = istekler[2];
                const neymardan_drogbaya_arkadaslik_istegi = istekler[3];
                const drogbadan_ronaldoya_arkadaslik_istegi = istekler[4];
                Promise.all([
                    this._userService.acceptFriendShipRequest(ronaldodan_messiye_arkadaslik_istegi, messi._id),
                    this._userService.acceptFriendShipRequest(ronaldodan_neymara_arkadaslik_istegi, neymar._id),
                    this._userService.acceptFriendShipRequest(drogbadan_messiye_arkadaslik_istegi, messi._id),
                    this._userService.acceptFriendShipRequest(neymardan_drogbaya_arkadaslik_istegi, drogba._id),
                    this._userService.acceptFriendShipRequest(drogbadan_ronaldoya_arkadaslik_istegi, ronaldo._id),
                ]).then((arkadaslik) => {
                    console.log(arkadaslik);
                }).catch((error) => {
                    console.log(error);
                })

            }).catch((error) => {
                console.log(error);
            });



        }).catch((error) => {
            console.log(error);
        });
    }


}