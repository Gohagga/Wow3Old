import { UnitConfigurable } from "Global/UnitConfigurable";
import { SpellEvent } from "Global/SpellEvent";
import { Order } from "Global/Order";
import { LastTarget } from "Global/LastTarget";
import { HeroStats } from "Global/HeroStats";
import { Ignite } from "./Ignite";
import { DamageDisplay } from "Global/DamageDisplay";
import { HotStreak } from "./HotStreak";
import { SimError } from "Global/SimError";

export type FireBlastConfig = {
    DamageAmount: number,
    Range: number,
    BonusCrit: number
}

export class FireBlast extends UnitConfigurable {
    public static SpellId: number;
    public static Order = Order.BERSERK;
    public static Sfx: string;
    public static AttackType = ATTACK_TYPE_MAGIC;
    public static DamageType = DAMAGE_TYPE_MAGIC;
    private static DefaultConfig: FireBlastConfig = {
        DamageAmount: 1.02,
        Range: 700.0,
        BonusCrit: 0
    }

    public static init(spellId: number, sfxModel: string) {
        this.SpellId = spellId;
        this.Sfx = sfxModel;
        this.SetDefaultConfig<FireBlastConfig>(this.DefaultConfig);
        SpellEvent.RegisterSpellCast(this.SpellId, () => {
            
            const data = this.GetUnitConfig<FireBlastConfig>(GetTriggerUnit());
            this.UpdateUnitConfig<FireBlastConfig>(GetTriggerUnit(), (cfg) => {
                
                const caster = GetTriggerUnit();
                const target = LastTarget.Get(caster);
                const data = this.GetUnitConfig<FireBlastConfig>(caster);
                const stats = new HeroStats(caster);
                let damage = GetHeroInt(caster, true) * data.DamageAmount;
                let manaBack = 0;

                if (target) {
                    if (IsUnitInRange(caster, target, data.Range)) {

                        stats.WithBonusCritDo(data.BonusCrit, () => {
                            UnitDamageTarget(caster, target, damage, true, false, this.AttackType, this.DamageType, WEAPON_TYPE_WHOKNOWS);
                            Ignite.AddIfHasAbility(target, caster, DamageDisplay.EventDamagedAfterAmount);
                            if (DamageDisplay.EventDamageWasCrit) {
                                HotStreak.Add(caster);
                            }
                        });
                        DestroyEffect(AddSpecialEffectTarget(this.Sfx, target, "chest"));
                        QueueUnitAnimation(caster, "spell");
                    } else {
                        SimError.Msg(GetOwningPlayer(caster), "Target out of range.");
                        manaBack = BlzGetAbilityManaCost(this.SpellId, GetUnitAbilityLevel(caster, this.SpellId));
                        BlzEndUnitAbilityCooldown(caster, this.SpellId)
                        SetUnitState(caster, UNIT_STATE_MANA, GetUnitState(caster, UNIT_STATE_MANA) + manaBack);
                    }
                } else {
                    SimError.Msg(GetOwningPlayer(caster), "There is no target.");
                    manaBack = BlzGetAbilityManaCost(this.SpellId, GetUnitAbilityLevel(caster, this.SpellId));
                    BlzEndUnitAbilityCooldown(caster, this.SpellId)
                    SetUnitState(caster, UNIT_STATE_MANA, GetUnitState(caster, UNIT_STATE_MANA) + manaBack);
                }
            });
        });
    }
}