import { FriendShipRepository, UserRepository } from '../dataAccess/repository';
export function arkadasOL() {

    let fr = new FriendShipRepository();
    let ur = new UserRepository();

    //NEYMARIN RONALDONUN ARKADAŞLIK ISTEGINI KABUL ETMESI
    const f1 = {
        sender: "5b312264c9d88a1b703e661c",
        acceptor: "5b312264c9d88a1b703e661d"
    };
    fr.create(f1).then((friendship) => {
      
    }).catch((error) => {
        console.log('Arkadaş Olunamadı Hata.');
    });
}