import { UnitConfigurable } from "Global/UnitConfigurable";
import { SpellEvent } from "Global/SpellEvent";
import { Order } from "Global/Order";

export type FireBlastConfig = {
    DamageAmount: number,
    Range: number,
    BonusCrit: number
}

export class FireBlast extends UnitConfigurable {
    public static Id = FourCC("AHfs");
    public static Order = Order.BERSERK;
    private static DefaultConfig: FireBlastConfig = {
        DamageAmount: 1.02,
        Range: 700.0,
        BonusCrit: 0
    }

    public static init() {
        this.SetDefaultConfig<FireBlastConfig>(this.DefaultConfig);
        SpellEvent.RegisterSpellCast(this.Id, () => {
            
            const data = this.GetUnitConfig<FireBlastConfig>(GetTriggerUnit());
            print("Flamestrike cast");
            this.UpdateUnitConfig<FireBlastConfig>(GetTriggerUnit(), (cfg) => {
                
            });
        });
    }
}