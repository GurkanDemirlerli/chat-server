import { container } from './../server';
import { IOC } from "../ioc";
import { VeriYukle } from './veri-yukle';


// const container = IOC.configureContainer();
container
    .bind<VeriYukle>(VeriYukle)
    .toSelf()
const veriYukle = container.get(VeriYukle);

veriYukle.kullaniciEkle();





// import { kullaniciArat } from './kullanici-arat';
// kullaniciArat();

// import { kullaniciEkleme } from './kullanici-ekleme';
// kullaniciEkleme();

// import { arkadasOL } from './arkadas-olma';
// arkadasOL();

