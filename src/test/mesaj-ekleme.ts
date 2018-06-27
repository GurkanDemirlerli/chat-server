import { MessageRepository } from './../dataAccess/repository';



let mr = new MessageRepository();

const m1 = {
    content: "Ronaldo'dan Messi'ye",
    from: "5b30dc2f7a2a611efcc00621",
    to: "5b30dc2f7a2a611efcc00622"
}

const m2 = {
    content: "Neymardan'dan Ronaldo'ya",
    from: "5b30dc2f7a2a611efcc00623",
    to: "5b30dc2f7a2a611efcc00621"
}

const m3 = {
    content: "Messi'den Neymar'a",
    from: "5b30dc2f7a2a611efcc00622",
    to: "5b30dc2f7a2a611efcc00623"
}

const m4 = {
    content: "Neymardan'dan Ronaldo'ya 2",
    from: "5b30dc2f7a2a611efcc00623",
    to: "5b30dc2f7a2a611efcc00621"
}

const m5 = {
    content: "Ronaldo'dan Neymar'a",
    from: "5b30dc2f7a2a611efcc00621",
    to: "5b30dc2f7a2a611efcc00623"
}

mr.create(m1).then((message) => {
    console.log("Message Created :", message);
}).catch((error) => {
    console.log("Message Did Not Created :",error);
});

mr.create(m2).then((message) => {
    console.log("Message Created :", message);
}).catch((error) => {
    console.log("Message Did Not Created :",error);
});

mr.create(m3).then((message) => {
    console.log("Message Created :", message);
}).catch((error) => {
    console.log("Message Did Not Created :",error);
});

mr.create(m4).then((message) => {
    console.log("Message Created :", message);
}).catch((error) => {
    console.log("Message Did Not Created :",error);
});

mr.create(m5).then((message) => {
    console.log("Message Created :", message);
}).catch((error) => {
    console.log("Message Did Not Created :",error);
});



