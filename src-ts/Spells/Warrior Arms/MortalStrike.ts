import { SpellEvent } from "Global/SpellEvent";
import { LastTarget } from "Global/LastTarget";
import { ScorchConfig, Scorch } from "Spells/Mage Fire/Scorch";
import { HeroStats } from "Global/HeroStats";
import { UnitConfigurable } from "Global/UnitConfigurable";
import { Order } from "Global/Order";
import { Slam } from "./Slam";
import { GlobalCooldown } from "Global/GlobalCooldown";

export class MortalStrike extends UnitConfigurable {
    public static SpellId: number;
    public static BuffId: number;

    public static holyCondition = false;
    
    public static SetOnCooldown(unit: unit) {

        print("Mortal strike Set on Cooldown")
        // this.isSharedCooldown[GetHandleId(unit)] = true;
        // IssueImmediateOrderById(unit, Order.MANASHIELDON);
    }

    static init(spellId: number, buffId: number) {
        this.SpellId = spellId;
        this.BuffId = buffId;
        const t = CreateTrigger();
        SpellEvent.RegisterSpellEnd(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const casterId = GetHandleId(caster);
            const stats = new HeroStats(caster);
            const castTime = 1.5 / stats.Haste();
            UnitRemoveAbility(caster, this.BuffId);

            if (GlobalCooldown.CheckAndTrigger(caster, this.SpellId, castTime)) {

                print("Cast Mortal Strike!");
            } else {
                print("on gcd");
                BlzEndUnitAbilityCooldown(caster, this.SpellId);
                BlzFrameSetLevel
            }
        });
    }
}