import { UnitConfigurable } from "Global/UnitConfigurable";
import { SpellEvent } from "Global/SpellEvent";
import { Order } from "Global/Order";

export type FireBlastConfig = {
    value1: number,
    value2: number,
    value3: boolean
}

export class FireBlast extends UnitConfigurable {
    public static Id = FourCC("AHfs");
    public static Order = Order.BERSERK;
    private static DefaultConfig: FireBlastConfig = {
        value1: 1,
        value2: 0.1,
        value3: false
    }

    public static init() {
        this.SetDefaultConfig<FireBlastConfig>(this.DefaultConfig);
        SpellEvent.RegisterSpellCast(this.Id, () => {
            
            const data = this.GetUnitConfig<FireBlastConfig>(GetTriggerUnit());
            print("Flamestrike cast", data.value1, data.value2, data.value3);
            this.UpdateUnitConfig<FireBlastConfig>(GetTriggerUnit(), (cfg) => {
                cfg.value1 = data.value1 + 1,
                cfg.value2 = data.value2 + 0.1,
                cfg.value3 = !data.value3
            });
        });
    }
}