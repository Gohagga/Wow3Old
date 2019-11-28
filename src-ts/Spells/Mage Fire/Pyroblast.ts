import { UnitConfigurable } from "Global/UnitConfigurable";
import { Order } from "Global/Order";
import { SpellEvent } from "Global/SpellEvent";
import { HeroStats } from "Global/HeroStats";
import { CastBar } from "Global/ProgressBars";
import { TriggeredMissile } from "Global/TriggeredMissile";
import { HotStreak } from "./HotStreak";
import { DamageDisplay } from "Global/DamageDisplay";
import { Ignite } from "./Ignite";

export type PyroblastConfig = {
    DamageAmount: number,
    CastTime: number,
    NonInterrupt: number[],
    BonusMastery: number,
}

export class Pyroblast extends UnitConfigurable {
    public static readonly SpellId = Spells.Pyroblast;
    public static readonly DummyId = Dummies.Pyroblast;
    public static readonly DummyOrder = Order.SHADOWSTRIKE;
    public static readonly AttackType = ATTACK_TYPE_MAGIC;
    public static readonly DamageType = DAMAGE_TYPE_MAGIC;

    private static DefaultConfig: PyroblastConfig = {
        DamageAmount: 3.0,
        CastTime: 4.0,
        NonInterrupt: [ Order.NIGHTELFBUILD ],
        BonusMastery: 1,
    }

    static init() {
        this.SetDefaultConfig<PyroblastConfig>(this.DefaultConfig);
        SpellEvent.RegisterSpellCast(this.SpellId, () => {

            const caster = GetTriggerUnit();
            const target = GetSpellTargetUnit();
            const data = this.GetUnitConfig<PyroblastConfig>(caster);
            const stats = new HeroStats(caster);
            let damage = GetHeroInt(caster, true) * data.DamageAmount;
            let castTime = data.CastTime / stats.Haste();
            
            if (HotStreak.Consume(caster)) {

                IssueImmediateOrderById(caster, Order.STANDDOWN);
                SetUnitAnimation(caster, "spell");
                const missile = new TriggeredMissile(caster, this.DummyId, this.DummyOrder, 1);
                missile.CastAtTargetAndDo(target, (m) => {
                    UnitDamageTarget(caster, target, damage, false, false, this.AttackType, this.DamageType, WEAPON_TYPE_WHOKNOWS);
                    stats.WithBonusMasteryDo(data.BonusMastery * stats.Mastery() + 100, () => {
                        Ignite.AddIfHasAbility(target, caster, DamageDisplay.EventDamagedAfterAmount);
                    });
                    if (DamageDisplay.EventDamageWasCrit) {
                        HotStreak.Add(caster);
                    }
                });
            } else {
                const cb = new CastBar(caster);
                cb.CastSpell(this.SpellId, castTime, () => {
                    cb.Finish();
    
                    IssueImmediateOrderById(caster, Order.STANDDOWN);
                    SetUnitAnimation(caster, "spell");
                    const missile = new TriggeredMissile(caster, this.DummyId, this.DummyOrder, 1);
                    missile.CastAtTargetAndDo(target, (m) => {
                        UnitDamageTarget(caster, target, damage, false, false, this.AttackType, this.DamageType, WEAPON_TYPE_WHOKNOWS);
                        stats.WithBonusMasteryDo(data.BonusMastery * stats.Mastery() + 100, () => {
                            Ignite.AddIfHasAbility(target, caster, DamageDisplay.EventDamagedAfterAmount);
                        });
                        if (DamageDisplay.EventDamageWasCrit) {
                            HotStreak.Add(caster);
                        }
                    });
                });
            }
        });
    }
}