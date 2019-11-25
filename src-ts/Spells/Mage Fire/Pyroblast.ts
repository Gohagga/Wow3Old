import { UnitConfigurable } from "Global/UnitConfigurable";
import { Order } from "Global/Order";

export type PyroblastConfig = {
    DamageAmount: number,
    CastTime: number,
    NonInterrupt: number[],
    BonusMastery: number,
}

export class Pyroblast extends UnitConfigurable {
    private static DefaultConfig = {
        DamageAmount: 3.0,
        CastTime: 4.0,
        NonInterrupt: [ Order.NIGHTELFBUILD ],
        BonusMastery: 1,
    }

    static init() {
        this.SetDefaultConfig(this.DefaultConfig);
    }
}