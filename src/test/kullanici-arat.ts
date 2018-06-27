import { UserRepository } from '../dataAccess/repository';

export function kullaniciArat() {

    let fr = new UserRepository();

    fr.searchUsers('onal', 3, 0).then((users) => {
        console.log('Kullanıcılar Bulundu', users);
    }).catch((error) => {
        console.log('Kullanicilar Bulunurken Hata', error);
    });
}
