import { UnitConfigurable } from "Global/UnitConfigurable";
import { Order } from "Global/Order";
import { SpellEvent } from "Global/SpellEvent";
import { HeroStats } from "Global/HeroStats";
import { CastBar } from "Global/ProgressBars";
import { TriggeredMissile } from "Global/TriggeredMissile";
require("Config");

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

    private static DefaultConfig = {
        DamageAmount: 3.0,
        CastTime: 4.0,
        NonInterrupt: [ Order.NIGHTELFBUILD ],
        BonusMastery: 1,
    }

    static init() {
        this.SetDefaultConfig(this.DefaultConfig);
        SpellEvent.RegisterSpellCast(this.SpellId, () => {
            
            const caster = GetTriggerUnit();
            const target = GetSpellTargetUnit();
            const data = this.GetUnitConfig<PyroblastConfig>(caster);
            const stats = new HeroStats(caster);
            let damage = GetHeroInt(caster, true) * data.DamageAmount;
            let castTime = data.CastTime / stats.Haste();
            
            
            const cb = new CastBar(caster);
            cb.CastSpell(this.SpellId, castTime, () => {
                cb.Finish();

                IssueImmediateOrderById(caster, Order.STOP);
                SetUnitAnimation(caster, "spell");
                const missile = new TriggeredMissile(caster, this.DummyId, this.DummyOrder, 1);
                missile.CastAtTargetAndDo(target, (m) => {
                    UnitDamageTarget(caster, target, damage, false, false, this.AttackType, this.DamageType, WEAPON_TYPE_WHOKNOWS);
                    stats.WithBonusMasteryDo(data.BonusMastery * stats.Mastery() + 100, () => {
                        // Ignite.Add(caster, target, DamageAfterAmount);
                    });
                    if (false) {
                        // HotStreak.Add(caster);
                    }
                });
            });
        });
    }
}