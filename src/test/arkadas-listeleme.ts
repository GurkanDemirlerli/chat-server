import { IUser } from './../models/DataAccessObjects/abstract/IUser';
import { UserRepository } from '../dataAccess/repository';
export function arkadasListele() {

    let ur = new UserRepository();


    ur.listMyFriends("5b312264c9d88a1b703e661c").then((friends: IUser[]) => {
        console.log('Arkadaşlar Bulundu : ', friends[0].SendedFriendShips);
    }).catch((error) => {
        console.log('Arkadaş Olunamadı Hata.');
    });
}