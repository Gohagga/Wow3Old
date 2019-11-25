import { UnitConfigurable } from "Global/UnitConfigurable";

export type IgniteConfig = {
    Duration: number,
    DamageAmount: number,
    Wildfire: boolean,
    DamageTickTime: number,
    SpreadTickTime: number,
    SpreadRange: number,
}

export class Ignite extends UnitConfigurable {
    private static DefaultConfig: IgniteConfig = {
        Duration: 9,
        DamageAmount: 0,
        Wildfire: false,
        DamageTickTime: 1.0,
        SpreadTickTime: 2.0,
        SpreadRange: 300.0
    }

    static init() {
        this.SetDefaultConfig(this.DefaultConfig);
    }
}