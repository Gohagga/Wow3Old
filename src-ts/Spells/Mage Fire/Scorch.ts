import { UnitConfigurable } from "Global/UnitConfigurable";
import { Order } from "Global/Order";

export type ScorchConfig = {
    DamageAmount: number,
    CastTime: number,
    Range: number,
    Firestarter: boolean,
    NonInterrupt: number[],
    BonusCrit: number
}

export class Scorch extends UnitConfigurable {
    private static DefaultConfig = {
        DamageAmount: 1.5,
        CastTime: 2.0,
        Range: 700.0,
        Firestarter: false,
        NonInterrupt: [ Order.MANASHIELDON ],
        BonusCrit: 0,
    }

    static init() {

    }
}