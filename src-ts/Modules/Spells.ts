import { Flamestrike } from "../Spells/Flamestrike";

export namespace Module {
    export class Spells {

        static init() {
            Flamestrike.init();
        }
    }
}