import { inject, injectable } from "inversify";
import { IOCTYPES } from "../ioc";
import { IUserService, IMessageService } from "../business";
import { ISignupModel, IFriendRequestCreateModel, IFriendRequest, IMessage } from '../models';

@injectable()
export class VeriYukle {

    constructor(
        @inject(IOCTYPES.USER_SERVICE) private _userService: IUserService,
        @inject(IOCTYPES.MESSAGE_SERVICE) private _messsageService: IMessageService
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

            let ronaldodan_messiye_arkadaslik_istegi: IFriendRequest = <IFriendRequest>{
                sender: ronaldo._id,
                receiver: messi._id,
            };

            let ronaldodan_neymara_arkadaslik_istegi: IFriendRequest = <IFriendRequest>{
                sender: ronaldo._id,
                receiver: neymar._id,
            };

            let drogbadan_messiye_arkadaslik_istegi: IFriendRequest = <IFriendRequest>{
                sender: drogba._id,
                receiver: messi._id
            }

            let neymardan_drogbaya_arkadaslik_istegi: IFriendRequest = <IFriendRequest>{
                sender: neymar._id,
                receiver: drogba._id
            }

            let drogbadan_ronaldoya_arkadaslik_istegi: IFriendRequest = <IFriendRequest>{
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
                const ronaldodan_messiye_arkadaslik_istegi_id = istekler[0]._id;
                const ronaldodan_neymara_arkadaslik_istegi_id = istekler[1]._id;
                const drogbadan_messiye_arkadaslik_istegi_id = istekler[2]._id;
                const neymardan_drogbaya_arkadaslik_istegi_id = istekler[3]._id;
                const drogbadan_ronaldoya_arkadaslik_istegi_id = istekler[4]._id;
                Promise.all([
                    this._userService.acceptFriendShipRequest(ronaldodan_messiye_arkadaslik_istegi_id, messi._id),
                    this._userService.acceptFriendShipRequest(ronaldodan_neymara_arkadaslik_istegi_id, neymar._id),
                    this._userService.acceptFriendShipRequest(drogbadan_messiye_arkadaslik_istegi_id, messi._id),
                    this._userService.acceptFriendShipRequest(neymardan_drogbaya_arkadaslik_istegi_id, drogba._id),
                    this._userService.acceptFriendShipRequest(drogbadan_ronaldoya_arkadaslik_istegi_id, ronaldo._id),
                ]).then((arkadaslik) => {
                    console.log(arkadaslik);

                    //Ronaldonun Arkadaslarini goster.
                    this._userService.listMyFriends(ronaldo._id).then((arkadaslar) => {
                        console.log('Ronaldonun Arkadaşları', arkadaslar);

                        let ronaldodan_messiye_mesaj_1: IMessage = <IMessage>{
                            content: "In ac consectetur. Incondimentum",
                            from: ronaldo._id,
                            to: messi._id
                        };

                        let messiden_ronaldoya_mesaj_1: IMessage = <IMessage>{
                            content: "quis nostrud exercitation ullamco consectetur",
                            from: messi._id,
                            to: ronaldo._id
                        };

                        let ronaldodan_messiye_mesaj_2: IMessage = <IMessage>{
                            content: "mollit anim id est laborum.",
                            from: ronaldo._id,
                            to: messi._id
                        };

                        let ronaldodan_messiye_mesaj_3: IMessage = <IMessage>{
                            content: "usmod tempor incididunt ut labore et",
                            from: ronaldo._id,
                            to: messi._id
                        };

                        let messiden_ronaldoya_mesaj_2: IMessage = <IMessage>{
                            content: "Duis aute irure int occaecat cupidatat non",
                            from: messi._id,
                            to: ronaldo._id
                        };

                        Promise.all([
                            this._messsageService.add(ronaldodan_messiye_mesaj_1),
                            this._messsageService.add(messiden_ronaldoya_mesaj_1),
                            this._messsageService.add(ronaldodan_messiye_mesaj_2),
                            this._messsageService.add(ronaldodan_messiye_mesaj_3),
                            this._messsageService.add(messiden_ronaldoya_mesaj_2),
                        ]).then((mesajlar) => {
                            console.log("Ronaldo ve Messi Arasındaki Mesajlar", mesajlar);
                        }).catch((error) => {
                            console.log(error);
                        })

                    }).catch((error) => {
                        console.log(error);
                    });
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