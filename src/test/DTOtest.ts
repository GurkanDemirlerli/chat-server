import { SignupInput } from "../models/DataTransferObjects/concrete/SignupInput";

function test() {
    const model = new SignupInput(
        "modric@example.com",
        "modric10",
        "luka",
        "modric",
        "Passowrd123."
    );
    console.log(model);
}


test();